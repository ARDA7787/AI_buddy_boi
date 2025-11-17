"""Safety and emergency information routes."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from ..database import get_db
from ..models.user import User
from ..models.trip import Trip, Alert
from ..schemas.trip import AlertResponse
from ..utils.auth import get_current_user
from ..services.external_apis import get_location_safety_score, get_location_alerts

router = APIRouter(prefix="/safety", tags=["safety"])


@router.get("/location", response_model=Dict[str, Any])
async def get_safety_info(
    latitude: float = Query(..., description="Latitude"),
    longitude: float = Query(..., description="Longitude"),
    location_name: str = Query(..., description="Location name"),
    current_user: User = Depends(get_current_user),
):
    """Get safety information for a specific location."""
    safety_data = await get_location_safety_score(latitude, longitude, location_name)
    alerts = await get_location_alerts(latitude, longitude, location_name)

    return {
        "safety_score": safety_data,
        "active_alerts": alerts
    }


@router.get("/trips/{trip_id}/alerts", response_model=List[AlertResponse])
async def get_trip_alerts(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all alerts for a trip."""
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

    # Get unresolved alerts
    alerts = db.query(Alert).filter(
        Alert.trip_id == trip_id,
        Alert.resolved_at.is_(None)
    ).order_by(Alert.created_at.desc()).all()

    return [AlertResponse.model_validate(alert) for alert in alerts]


@router.post("/trips/{trip_id}/alerts/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(
    trip_id: int,
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark an alert as resolved."""
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

    # Get alert
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.trip_id == trip_id
    ).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )

    # Resolve alert
    from datetime import datetime
    alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)

    return AlertResponse.model_validate(alert)
