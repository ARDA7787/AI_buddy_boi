"""Chat schemas."""
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from ..models.chat import MessageRole


class MessageCreate(BaseModel):
    """Message creation schema."""
    content: str
    metadata: Dict[str, Any] = {}


class MessageResponse(BaseModel):
    """Message response schema."""
    id: int
    trip_id: int
    user_id: int
    role: MessageRole
    content: str
    metadata: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    """Chat request schema."""
    message: str
    trip_id: int


class ChatResponse(BaseModel):
    """Chat response schema."""
    message: MessageResponse
    suggested_actions: list[Dict[str, Any]] = []
