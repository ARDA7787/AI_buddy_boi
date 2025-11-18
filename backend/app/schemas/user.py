"""User schemas."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: Optional[str] = None
    age: Optional[int] = None
    home_country: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema."""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """User login schema."""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """User update schema."""
    name: Optional[str] = None
    age: Optional[int] = None
    home_country: Optional[str] = None


class PreferencesUpdate(BaseModel):
    """User preferences update schema."""
    budget_per_day: Optional[float] = None
    interests: Optional[list[str]] = None
    travel_style: Optional[str] = Field(None, pattern="^(chilled|balanced|packed)$")
    risk_tolerance: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    dietary_restrictions: Optional[list[str]] = None
    accessibility_needs: Optional[list[str]] = None
    activity_preferences: Optional[Dict[str, Any]] = None


class UserResponse(UserBase):
    """User response schema."""
    id: int
    preferences: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
