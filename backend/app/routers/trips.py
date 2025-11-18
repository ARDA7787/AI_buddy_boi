"""Trip routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from ..database import get_db
from ..models.user import User
from ..models.trip import Trip, Day, Activity, TripStatus, ActivityCategory, ActivityStatus
from ..schemas.trip import (
    TripCreate,
    TripUpdate,
    TripResponse,
    ItineraryGenerateRequest,
)
from ..utils.auth import get_current_user
from ..services.llm_agent import generate_itinerary
from ..services.external_apis import geocode_location

router = APIRouter(prefix="/trips", tags=["trips"])


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    trip_data: TripCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new trip."""
    # Geocode the destination
    location_data = await geocode_location(trip_data.destination)

    trip = Trip(
        user_id=current_user.id,
        destination=trip_data.destination,
        start_date=trip_data.start_date,
        end_date=trip_data.end_date,
        total_budget=trip_data.total_budget,
        status=TripStatus.PLANNING,
        metadata={
            "destination_country": location_data.get("country") if location_data else None,
            "destination_city": location_data.get("city") if location_data else None,
            "coordinates": {
                "lat": location_data.get("latitude"),
                "lng": location_data.get("longitude")
            } if location_data else None
        }
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)

    return TripResponse.model_validate(trip)


@router.get("", response_model=List[TripResponse])
async def get_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all trips for the current user."""
    trips = db.query(Trip).filter(Trip.user_id == current_user.id).order_by(Trip.created_at.desc()).all()
    return [TripResponse.model_validate(trip) for trip in trips]


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific trip."""
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    return TripResponse.model_validate(trip)


@router.patch("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: int,
    trip_data: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a trip."""
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    if trip_data.destination is not None:
        trip.destination = trip_data.destination
    if trip_data.start_date is not None:
        trip.start_date = trip_data.start_date
    if trip_data.end_date is not None:
        trip.end_date = trip_data.end_date
    if trip_data.status is not None:
        trip.status = trip_data.status
    if trip_data.total_budget is not None:
        trip.total_budget = trip_data.total_budget

    db.commit()
    db.refresh(trip)

    return TripResponse.model_validate(trip)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a trip."""
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    db.delete(trip)
    db.commit()


@router.post("/{trip_id}/generate-itinerary", response_model=TripResponse)
async def generate_trip_itinerary(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate an itinerary for a trip using AI."""
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == current_user.id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    # Generate itinerary using LLM
    itinerary_data = generate_itinerary(
        destination=trip.destination,
        start_date=trip.start_date,
        end_date=trip.end_date,
        user_preferences=current_user.preferences or {},
        budget=trip.total_budget,
        constraints=None
    )

    # Delete existing days/activities if any
    for day in trip.days:
        db.delete(day)

    # Create days and activities from generated itinerary
    for day_data in itinerary_data.get("days", []):
        day_date = datetime.strptime(day_data["date"], "%Y-%m-%d")

        day = Day(
            trip_id=trip.id,
            date=day_date,
            index=day_data["day_number"],
            notes=None
        )
        db.add(day)
        db.flush()  # Get the day ID

        for activity_data in day_data.get("activities", []):
            # Parse times
            start_time_str = activity_data["start_time"]
            end_time_str = activity_data["end_time"]

            start_time = datetime.strptime(
                f"{day_data['date']} {start_time_str}",
                "%Y-%m-%d %H:%M"
            )
            end_time = datetime.strptime(
                f"{day_data['date']} {end_time_str}",
                "%Y-%m-%d %H:%M"
            )

            activity = Activity(
                day_id=day.id,
                title=activity_data["title"],
                description=activity_data.get("description"),
                category=ActivityCategory(activity_data["category"]),
                start_time=start_time,
                end_time=end_time,
                location=activity_data.get("location"),
                latitude=activity_data.get("latitude"),
                longitude=activity_data.get("longitude"),
                cost_estimate=activity_data.get("cost_estimate"),
                source="ai",
                status=ActivityStatus.PLANNED,
                metadata={"tips": activity_data.get("tips")}
            )
            db.add(activity)

    db.commit()
    db.refresh(trip)

    return TripResponse.model_validate(trip)


@router.post("/generate", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_and_generate_trip(
    request: ItineraryGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new trip and generate its itinerary in one step."""
    # Geocode the destination
    location_data = await geocode_location(request.destination)

    # Create trip
    trip = Trip(
        user_id=current_user.id,
        destination=request.destination,
        start_date=request.start_date,
        end_date=request.end_date,
        total_budget=request.budget,
        status=TripStatus.PLANNING,
        metadata={
            "destination_country": location_data.get("country") if location_data else None,
            "destination_city": location_data.get("city") if location_data else None,
            "coordinates": {
                "lat": location_data.get("latitude"),
                "lng": location_data.get("longitude")
            } if location_data else None
        }
    )
    db.add(trip)
    db.flush()

    # Build user preferences for this request
    user_prefs = current_user.preferences or {}
    if request.interests:
        user_prefs["interests"] = request.interests
    if request.travel_style:
        user_prefs["travel_style"] = request.travel_style

    # Generate itinerary
    itinerary_data = generate_itinerary(
        destination=request.destination,
        start_date=request.start_date,
        end_date=request.end_date,
        user_preferences=user_prefs,
        budget=request.budget,
        constraints=request.constraints
    )

    # Create days and activities
    for day_data in itinerary_data.get("days", []):
        day_date = datetime.strptime(day_data["date"], "%Y-%m-%d")

        day = Day(
            trip_id=trip.id,
            date=day_date,
            index=day_data["day_number"],
            notes=None
        )
        db.add(day)
        db.flush()

        for activity_data in day_data.get("activities", []):
            start_time = datetime.strptime(
                f"{day_data['date']} {activity_data['start_time']}",
                "%Y-%m-%d %H:%M"
            )
            end_time = datetime.strptime(
                f"{day_data['date']} {activity_data['end_time']}",
                "%Y-%m-%d %H:%M"
            )

            activity = Activity(
                day_id=day.id,
                title=activity_data["title"],
                description=activity_data.get("description"),
                category=ActivityCategory(activity_data["category"]),
                start_time=start_time,
                end_time=end_time,
                location=activity_data.get("location"),
                latitude=activity_data.get("latitude"),
                longitude=activity_data.get("longitude"),
                cost_estimate=activity_data.get("cost_estimate"),
                source="ai",
                status=ActivityStatus.PLANNED,
                metadata={"tips": activity_data.get("tips")}
            )
            db.add(activity)

    db.commit()
    db.refresh(trip)

    return TripResponse.model_validate(trip)
