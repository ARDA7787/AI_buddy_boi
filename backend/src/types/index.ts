// User and Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  password_hash?: string;
  preferences?: UserPreferences;
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferences {
  budget: 'low' | 'medium' | 'high';
  interests: string[];
  travelStyle: 'relaxed' | 'moderate' | 'adventurous';
  accommodationType: string[];
  dietaryRestrictions: string[];
}

// Trips
export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
  image_url?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// Itinerary
export interface Itinerary {
  id: string;
  trip_id: string;
  days: ItineraryDay[];
  created_at: Date;
  updated_at: Date;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  category: 'activity' | 'meal' | 'transport' | 'accommodation';
  duration?: string;
  cost?: number;
}

// Chat
export interface Message {
  id: string;
  user_id: string;
  trip_id?: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

// Safety
export interface SafetyInfo {
  status: 'safe' | 'warning' | 'danger';
  alerts: Alert[];
  emergency_contacts: EmergencyContact[];
  current_location?: string;
}

export interface Alert {
  id: string;
  type: 'weather' | 'health' | 'security' | 'general';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'police' | 'medical' | 'embassy' | 'personal';
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
