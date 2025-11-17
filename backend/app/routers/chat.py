"""Chat routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.user import User
from ..models.trip import Trip
from ..models.chat import Message, MessageRole
from ..schemas.chat import MessageCreate, MessageResponse, ChatRequest, ChatResponse
from ..utils.auth import get_current_user
from ..services.llm_agent import chat_with_agent

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/trips/{trip_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    trip_id: int,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chat messages for a trip."""
    # Verify trip belongs to user
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    messages = db.query(Message).filter(
        Message.trip_id == trip_id
    ).order_by(Message.created_at.desc()).limit(limit).all()

    # Reverse to get chronological order
    messages.reverse()

    return [MessageResponse.model_validate(msg) for msg in messages]


@router.post("", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message to the AI travel companion."""
    # Verify trip belongs to user
    trip = db.query(Trip).filter(
        Trip.id == chat_request.trip_id,
        Trip.user_id == current_user.id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    # Save user message
    user_message = Message(
        trip_id=chat_request.trip_id,
        user_id=current_user.id,
        role=MessageRole.USER,
        content=chat_request.message,
        metadata={}
    )
    db.add(user_message)
    db.commit()

    # Get conversation history
    history = db.query(Message).filter(
        Message.trip_id == chat_request.trip_id
    ).order_by(Message.created_at.desc()).limit(10).all()

    conversation_history = [
        {"role": msg.role.value, "content": msg.content}
        for msg in reversed(history[:-1])  # Exclude the message we just added
    ]

    # Prepare trip context
    trip_context = {
        "destination": trip.destination,
        "current_date": trip.start_date.strftime("%Y-%m-%d"),
        "status": trip.status.value,
        "budget": trip.total_budget
    }

    # Get AI response
    ai_response = chat_with_agent(
        message=chat_request.message,
        trip_context=trip_context,
        user_preferences=current_user.preferences or {},
        conversation_history=conversation_history
    )

    # Save assistant message
    assistant_message = Message(
        trip_id=chat_request.trip_id,
        user_id=current_user.id,
        role=MessageRole.ASSISTANT,
        content=ai_response["response"],
        metadata={"actions": ai_response.get("actions", [])}
    )
    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)

    return ChatResponse(
        message=MessageResponse.model_validate(assistant_message),
        suggested_actions=ai_response.get("actions", [])
    )
