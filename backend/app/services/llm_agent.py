"""LLM Agent service for itinerary generation and chat."""
import json
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from openai import OpenAI
from ..config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None


SYSTEM_PROMPT = """You are an expert AI travel companion for solo adventurers and group planners.

Your role is to:
1. Create personalized, detailed itineraries based on user preferences
2. Provide real-time travel assistance and re-planning
3. Offer safety guidance and cultural tips
4. Answer questions about destinations, activities, and logistics
5. Provide emotional support and companionship during travels

When generating itineraries:
- Consider user's budget, travel style (chilled/balanced/packed), interests, and constraints
- Include specific times, locations, estimated costs, and practical tips
- Balance popular attractions with local hidden gems
- Account for travel time between activities
- Suggest appropriate meal times and rest periods
- Include safety notes and accessibility information when relevant

When chatting:
- Be friendly, encouraging, and informative
- Provide specific, actionable advice
- Consider the user's current context (location, time, itinerary)
- Offer alternatives when appropriate
- Be culturally sensitive and safety-conscious

Always respond in a structured format when generating itineraries or suggestions."""


def generate_itinerary(
    destination: str,
    start_date: datetime,
    end_date: datetime,
    user_preferences: Dict[str, Any],
    budget: Optional[float] = None,
    constraints: Optional[str] = None,
) -> Dict[str, Any]:
    """Generate a trip itinerary using LLM."""
    if not client:
        # Return mock data if OpenAI is not configured
        return _generate_mock_itinerary(destination, start_date, end_date, budget)

    num_days = (end_date - start_date).days + 1
    budget_per_day = budget / num_days if budget else user_preferences.get("budget_per_day", 100)

    prompt = f"""Generate a detailed {num_days}-day itinerary for {destination}.

Trip Details:
- Destination: {destination}
- Dates: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')} ({num_days} days)
- Budget: ${budget_per_day:.2f} per day
- Travel Style: {user_preferences.get('travel_style', 'balanced')}
- Interests: {', '.join(user_preferences.get('interests', ['general sightseeing']))}
- Dietary Restrictions: {', '.join(user_preferences.get('dietary_restrictions', ['none']))}
- Additional Constraints: {constraints or 'none'}

Generate a comprehensive itinerary in the following JSON format:
{{
  "days": [
    {{
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {{
          "title": "Activity name",
          "description": "Detailed description",
          "category": "food|museum|sightseeing|shopping|nightlife|outdoor|cultural|relaxation|transport|other",
          "start_time": "HH:MM",
          "end_time": "HH:MM",
          "location": "Specific address or location name",
          "latitude": 0.0,
          "longitude": 0.0,
          "cost_estimate": 0.0,
          "tips": "Practical tips and notes"
        }}
      ]
    }}
  ]
}}

Make the itinerary realistic, well-paced, and tailored to the user's preferences."""

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)
        return result

    except Exception as e:
        print(f"Error generating itinerary with LLM: {e}")
        return _generate_mock_itinerary(destination, start_date, end_date, budget)


def generate_alternatives(
    disruption: str,
    affected_activity: Dict[str, Any],
    user_preferences: Dict[str, Any],
    destination: str,
) -> List[Dict[str, Any]]:
    """Generate alternative activities for a disrupted itinerary."""
    if not client:
        return _generate_mock_alternatives(affected_activity)

    prompt = f"""A planned activity is disrupted. Generate 3 alternative activities.

Disruption: {disruption}

Original Activity:
- Title: {affected_activity.get('title')}
- Category: {affected_activity.get('category')}
- Time: {affected_activity.get('start_time')} - {affected_activity.get('end_time')}
- Location: {affected_activity.get('location')}
- Budget: ${affected_activity.get('cost_estimate', 0)}

User Preferences:
- Interests: {', '.join(user_preferences.get('interests', []))}
- Travel Style: {user_preferences.get('travel_style', 'balanced')}

Generate 3 alternatives in JSON format:
{{
  "alternatives": [
    {{
      "title": "Alternative activity name",
      "description": "Why this is a good alternative",
      "category": "category",
      "start_time": "HH:MM",
      "end_time": "HH:MM",
      "location": "Location",
      "latitude": 0.0,
      "longitude": 0.0,
      "cost_estimate": 0.0,
      "fit_score": 0.85
    }}
  ]
}}"""

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)
        return result.get("alternatives", [])

    except Exception as e:
        print(f"Error generating alternatives with LLM: {e}")
        return _generate_mock_alternatives(affected_activity)


def chat_with_agent(
    message: str,
    trip_context: Dict[str, Any],
    user_preferences: Dict[str, Any],
    conversation_history: List[Dict[str, str]],
) -> Dict[str, Any]:
    """Chat with the AI travel companion."""
    if not client:
        return {
            "response": "I'm here to help! (Note: OpenAI API key not configured - this is a demo response)",
            "actions": []
        }

    # Build context
    context = f"""Current Trip Context:
- Destination: {trip_context.get('destination', 'Unknown')}
- Current Date: {trip_context.get('current_date', 'Unknown')}
- Trip Status: {trip_context.get('status', 'planning')}

User Preferences:
- Interests: {', '.join(user_preferences.get('interests', []))}
- Budget: ${user_preferences.get('budget_per_day', 100)}/day
- Travel Style: {user_preferences.get('travel_style', 'balanced')}"""

    # Prepare messages
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": context},
    ]

    # Add conversation history (last 10 messages)
    for msg in conversation_history[-10:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    # Add current message
    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            temperature=0.7,
        )

        assistant_message = response.choices[0].message.content

        return {
            "response": assistant_message,
            "actions": []  # Could include suggested itinerary changes, etc.
        }

    except Exception as e:
        print(f"Error in chat with LLM: {e}")
        return {
            "response": "I apologize, but I'm having trouble processing your request right now. Please try again.",
            "actions": []
        }


def _generate_mock_itinerary(
    destination: str,
    start_date: datetime,
    end_date: datetime,
    budget: Optional[float] = None,
) -> Dict[str, Any]:
    """Generate a mock itinerary for demo purposes."""
    num_days = (end_date - start_date).days + 1
    days = []

    for day_num in range(num_days):
        current_date = start_date + timedelta(days=day_num)

        activities = [
            {
                "title": "Breakfast at Local Café",
                "description": f"Start your day {day_num + 1} with a delicious local breakfast",
                "category": "food",
                "start_time": "08:00",
                "end_time": "09:00",
                "location": f"{destination} City Center",
                "latitude": 48.8566 + (day_num * 0.01),
                "longitude": 2.3522 + (day_num * 0.01),
                "cost_estimate": 15.0,
                "tips": "Try the local pastries!"
            },
            {
                "title": f"Visit Famous {destination} Museum",
                "description": "Explore the rich history and culture",
                "category": "museum",
                "start_time": "10:00",
                "end_time": "13:00",
                "location": f"{destination} Museum District",
                "latitude": 48.8606 + (day_num * 0.01),
                "longitude": 2.3376 + (day_num * 0.01),
                "cost_estimate": 25.0,
                "tips": "Book tickets online to skip the queue"
            },
            {
                "title": "Lunch at Traditional Restaurant",
                "description": "Enjoy authentic local cuisine",
                "category": "food",
                "start_time": "13:30",
                "end_time": "15:00",
                "location": f"{destination} Old Town",
                "latitude": 48.8529 + (day_num * 0.01),
                "longitude": 2.3499 + (day_num * 0.01),
                "cost_estimate": 30.0,
                "tips": "Ask for the chef's recommendation"
            },
            {
                "title": "Walking Tour of Historic District",
                "description": "Discover hidden gems and local stories",
                "category": "sightseeing",
                "start_time": "15:30",
                "end_time": "18:00",
                "location": f"{destination} Historic Center",
                "latitude": 48.8584 + (day_num * 0.01),
                "longitude": 2.2945 + (day_num * 0.01),
                "cost_estimate": 0.0,
                "tips": "Comfortable shoes recommended"
            },
            {
                "title": "Dinner with Sunset Views",
                "description": "Enjoy dinner at a rooftop restaurant",
                "category": "food",
                "start_time": "19:00",
                "end_time": "21:00",
                "location": f"{destination} Rooftop District",
                "latitude": 48.8738 + (day_num * 0.01),
                "longitude": 2.2950 + (day_num * 0.01),
                "cost_estimate": 50.0,
                "tips": "Make a reservation in advance"
            }
        ]

        days.append({
            "day_number": day_num + 1,
            "date": current_date.strftime("%Y-%m-%d"),
            "activities": activities
        })

    return {"days": days}


def _generate_mock_alternatives(affected_activity: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate mock alternative activities."""
    category = affected_activity.get("category", "other")
    return [
        {
            "title": f"Alternative Indoor {category.title()} Experience",
            "description": "A great backup option that's weather-proof",
            "category": category,
            "start_time": affected_activity.get("start_time", "10:00"),
            "end_time": affected_activity.get("end_time", "12:00"),
            "location": "Alternative Location 1",
            "latitude": 48.8566,
            "longitude": 2.3522,
            "cost_estimate": affected_activity.get("cost_estimate", 20),
            "fit_score": 0.9
        },
        {
            "title": f"Nearby {category.title()} Venue",
            "description": "Close to your current location",
            "category": category,
            "start_time": affected_activity.get("start_time", "10:00"),
            "end_time": affected_activity.get("end_time", "12:00"),
            "location": "Alternative Location 2",
            "latitude": 48.8606,
            "longitude": 2.3376,
            "cost_estimate": affected_activity.get("cost_estimate", 20) * 0.8,
            "fit_score": 0.85
        },
        {
            "title": f"Budget-Friendly {category.title()}",
            "description": "A more affordable option",
            "category": category,
            "start_time": affected_activity.get("start_time", "10:00"),
            "end_time": affected_activity.get("end_time", "12:00"),
            "location": "Alternative Location 3",
            "latitude": 48.8529,
            "longitude": 2.3499,
            "cost_estimate": affected_activity.get("cost_estimate", 20) * 0.5,
            "fit_score": 0.75
        }
    ]
