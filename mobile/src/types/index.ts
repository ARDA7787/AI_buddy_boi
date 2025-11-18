// User and Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
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
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  imageUrl?: string;
  description?: string;
}

// Itinerary
export interface Itinerary {
  id: string;
  tripId: string;
  days: ItineraryDay[];
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
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

// Safety
export interface SafetyInfo {
  status: 'safe' | 'warning' | 'danger';
  alerts: Alert[];
  emergencyContacts: EmergencyContact[];
  currentLocation?: string;
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

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
