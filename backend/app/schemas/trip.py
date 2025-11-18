"""Trip schemas."""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from ..models.trip import TripStatus, ActivityCategory, ActivityStatus, AlertType, AlertSeverity


class ActivityBase(BaseModel):
    """Base activity schema."""
    title: str
    description: Optional[str] = None
    category: ActivityCategory
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cost_estimate: Optional[float] = None
    booking_url: Optional[str] = None
    metadata: Dict[str, Any] = {}


class ActivityResponse(ActivityBase):
    """Activity response schema."""
    id: int
    day_id: int
    source: str
    status: ActivityStatus
    created_at: datetime

    class Config:
        from_attributes = True


class DayBase(BaseModel):
    """Base day schema."""
    date: datetime
    index: int
    notes: Optional[str] = None


class DayResponse(DayBase):
    """Day response schema."""
    id: int
    trip_id: int
    activities: List[ActivityResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class AlertResponse(BaseModel):
    """Alert response schema."""
    id: int
    trip_id: int
    activity_id: Optional[int] = None
    type: AlertType
    severity: AlertSeverity
    message: str
    alternatives: List[Dict[str, Any]] = []
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TripBase(BaseModel):
    """Base trip schema."""
    destination: str
    start_date: datetime
    end_date: datetime
    total_budget: Optional[float] = None


class TripCreate(TripBase):
    """Trip creation schema."""
    pass


class TripUpdate(BaseModel):
    """Trip update schema."""
    destination: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[TripStatus] = None
    total_budget: Optional[float] = None


class TripResponse(TripBase):
    """Trip response schema."""
    id: int
    user_id: int
    status: TripStatus
    metadata: Dict[str, Any] = {}
    days: List[DayResponse] = []
    alerts: List[AlertResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class ItineraryGenerateRequest(BaseModel):
    """Itinerary generation request schema."""
    destination: str
    start_date: datetime
    end_date: datetime
    budget: Optional[float] = None
    interests: List[str] = []
    travel_style: str = Field("balanced", pattern="^(chilled|balanced|packed)$")
    constraints: Optional[str] = None  # Free-form constraints like "slow mornings, nightlife, vegetarian"
