"""Pydantic schemas."""
from .user import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserResponse,
    Token,
    PreferencesUpdate,
)
from .trip import (
    TripCreate,
    TripUpdate,
    TripResponse,
    DayResponse,
    ActivityResponse,
    AlertResponse,
    ItineraryGenerateRequest,
)
from .chat import (
    MessageCreate,
    MessageResponse,
    ChatRequest,
    ChatResponse,
)

__all__ = [
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserResponse",
    "Token",
    "PreferencesUpdate",
    "TripCreate",
    "TripUpdate",
    "TripResponse",
    "DayResponse",
    "ActivityResponse",
    "AlertResponse",
    "ItineraryGenerateRequest",
    "MessageCreate",
    "MessageResponse",
    "ChatRequest",
    "ChatResponse",
]
