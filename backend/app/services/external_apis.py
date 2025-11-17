"""External API integrations for weather, maps, and safety data."""
import httpx
from typing import Dict, Any, Optional, List
from datetime import datetime
from ..config import settings


async def get_weather_forecast(
    latitude: float,
    longitude: float,
    date: datetime
) -> Dict[str, Any]:
    """Get weather forecast for a location and date."""
    if not settings.OPENWEATHER_API_KEY:
        return _get_mock_weather()

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.openweathermap.org/data/2.5/forecast",
                params={
                    "lat": latitude,
                    "lon": longitude,
                    "appid": settings.OPENWEATHER_API_KEY,
                    "units": "metric"
                },
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()

            # Process and return relevant weather data
            return {
                "temperature": data["list"][0]["main"]["temp"],
                "description": data["list"][0]["weather"][0]["description"],
                "humidity": data["list"][0]["main"]["humidity"],
                "wind_speed": data["list"][0]["wind"]["speed"],
                "precipitation_probability": data["list"][0].get("pop", 0) * 100,
            }
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return _get_mock_weather()


async def get_location_safety_score(
    latitude: float,
    longitude: float,
    location_name: str
) -> Dict[str, Any]:
    """Get safety score for a location."""
    # In production, this would integrate with safety APIs
    # For now, return mock data
    return {
        "score": 7.5,  # Out of 10
        "level": "moderate",  # safe, moderate, caution, danger
        "warnings": [],
        "tips": [
            "Stay aware of your surroundings",
            "Keep valuables secure",
            "Avoid isolated areas after dark"
        ],
        "emergency_numbers": {
            "police": "112",
            "ambulance": "112",
            "fire": "112"
        },
        "nearest_hospital": {
            "name": "City General Hospital",
            "address": f"Near {location_name}",
            "distance_km": 2.5,
            "phone": "+123456789"
        },
        "nearest_police": {
            "name": "Central Police Station",
            "address": f"{location_name} Police District",
            "distance_km": 1.2,
            "phone": "+123456788"
        }
    }


async def get_location_alerts(
    latitude: float,
    longitude: float,
    location_name: str
) -> List[Dict[str, Any]]:
    """Get current alerts for a location (protests, strikes, events, etc.)."""
    # In production, this would integrate with news/event APIs
    # For now, return empty or mock data
    return []


async def geocode_location(location: str) -> Optional[Dict[str, Any]]:
    """Convert location name to coordinates."""
    if not settings.GOOGLE_MAPS_API_KEY:
        return _get_mock_coordinates(location)

    # In production, use Google Maps Geocoding API
    # For now, return mock data
    return _get_mock_coordinates(location)


async def get_nearby_places(
    latitude: float,
    longitude: float,
    place_type: str,
    radius: int = 1000
) -> List[Dict[str, Any]]:
    """Get nearby places of a specific type."""
    # In production, use Google Places API
    # For now, return mock data
    return [
        {
            "name": f"Nearby {place_type.title()} 1",
            "address": "123 Main St",
            "rating": 4.5,
            "price_level": 2,
            "distance_meters": 500,
            "latitude": latitude + 0.005,
            "longitude": longitude + 0.005,
        },
        {
            "name": f"Nearby {place_type.title()} 2",
            "address": "456 Second Ave",
            "rating": 4.2,
            "price_level": 1,
            "distance_meters": 800,
            "latitude": latitude - 0.005,
            "longitude": longitude - 0.005,
        }
    ]


async def translate_text(text: str, target_language: str) -> str:
    """Translate text to target language."""
    # In production, use Google Translate API or similar
    # For now, return original text with note
    return f"{text} [Translation to {target_language}]"


def _get_mock_weather() -> Dict[str, Any]:
    """Return mock weather data."""
    return {
        "temperature": 22,
        "description": "partly cloudy",
        "humidity": 65,
        "wind_speed": 12,
        "precipitation_probability": 20,
    }


def _get_mock_coordinates(location: str) -> Dict[str, Any]:
    """Return mock coordinates for a location."""
    # Default to Paris coordinates
    return {
        "latitude": 48.8566,
        "longitude": 2.3522,
        "formatted_address": location,
        "country": "France",
        "city": location.split(",")[0].strip() if "," in location else location
    }
