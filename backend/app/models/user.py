"""User model."""
from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class User(Base):
    """User model."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    home_country = Column(String, nullable=True)

    # Preferences stored as JSON
    # Structure: {
    #   "budget_per_day": 100,
    #   "interests": ["culture", "food", "nightlife"],
    #   "travel_style": "balanced",  # chilled, balanced, packed
    #   "risk_tolerance": "medium",  # low, medium, high
    #   "dietary_restrictions": [],
    #   "accessibility_needs": [],
    #   "activity_preferences": {}
    # }
    preferences = Column(JSON, nullable=True, default={})

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="user", cascade="all, delete-orphan")
