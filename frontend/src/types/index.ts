/**
 * Type definitions for the AI Travel Buddy app
 */

export interface User {
  id: number;
  email: string;
  name?: string;
  age?: number;
  home_country?: string;
  preferences: UserPreferences;
  created_at: string;
}

export interface UserPreferences {
  budget_per_day?: number;
  interests?: string[];
  travel_style?: 'chilled' | 'balanced' | 'packed';
  risk_tolerance?: 'low' | 'medium' | 'high';
  dietary_restrictions?: string[];
  accessibility_needs?: string[];
  activity_preferences?: Record<string, any>;
}

export interface Trip {
  id: number;
  user_id: number;
  destination: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  total_budget?: number;
  metadata: {
    destination_country?: string;
    destination_city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  days: Day[];
  alerts: Alert[];
  created_at: string;
}

export interface Day {
  id: number;
  trip_id: number;
  date: string;
  index: number;
  notes?: string;
  activities: Activity[];
  created_at: string;
}

export interface Activity {
  id: number;
  day_id: number;
  title: string;
  description?: string;
  category: ActivityCategory;
  start_time: string;
  end_time: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  cost_estimate?: number;
  booking_url?: string;
  source: 'ai' | 'user';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'skipped';
  metadata: {
    tips?: string;
    rating?: number;
    reviews_count?: number;
  };
  created_at: string;
}

export type ActivityCategory =
  | 'food'
  | 'museum'
  | 'sightseeing'
  | 'shopping'
  | 'nightlife'
  | 'outdoor'
  | 'cultural'
  | 'relaxation'
  | 'transport'
  | 'accommodation'
  | 'other';

export interface Alert {
  id: number;
  trip_id: number;
  activity_id?: number;
  type: 'weather' | 'closure' | 'safety' | 'transit' | 'event' | 'general';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  alternatives: AlternativeActivity[];
  created_at: string;
  resolved_at?: string;
}

export interface AlternativeActivity {
  title: string;
  description: string;
  category: ActivityCategory;
  start_time: string;
  end_time: string;
  location: string;
  latitude: number;
  longitude: number;
  cost_estimate: number;
  fit_score: number;
}

export interface Message {
  id: number;
  trip_id: number;
  user_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: {
    type?: 'activity_suggestion' | 'translation' | 'safety_tip' | 'text';
    data?: any;
  };
  created_at: string;
}

export interface SafetyInfo {
  safety_score: {
    score: number;
    level: 'safe' | 'moderate' | 'caution' | 'danger';
    warnings: string[];
    tips: string[];
    emergency_numbers: {
      police: string;
      ambulance: string;
      fire: string;
    };
    nearest_hospital: {
      name: string;
      address: string;
      distance_km: number;
      phone: string;
    };
    nearest_police: {
      name: string;
      address: string;
      distance_km: number;
      phone: string;
    };
  };
  active_alerts: any[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CreateTripRequest {
  destination: string;
  start_date: string;
  end_date: string;
  total_budget?: number;
}

export interface GenerateItineraryRequest {
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  interests: string[];
  travel_style: 'chilled' | 'balanced' | 'packed';
  constraints?: string;
}
