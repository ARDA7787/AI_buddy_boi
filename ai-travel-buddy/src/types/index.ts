// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// Preferences types
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  currency: string;
}

// Trip types
export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'ongoing' | 'completed';
  budget?: number;
  itinerary: ItineraryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  day: number;
  date: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: Location;
  category: 'transport' | 'accommodation' | 'food' | 'sightseeing' | 'other';
  cost?: number;
  notes?: string;
}

export interface Location {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  tripId?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  tripId?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Safety types
export interface SafetyInfo {
  id: string;
  country: string;
  warnings: string[];
  emergencyNumbers: EmergencyContact[];
  healthInfo?: string;
  updatedAt: string;
}

export interface EmergencyContact {
  type: 'police' | 'ambulance' | 'fire' | 'embassy' | 'other';
  number: string;
  description?: string;
}

// Navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  TripList: undefined;
  TripDetail: { tripId: string };
};

export type MainTabParamList = {
  Itinerary: undefined;
  Chat: undefined;
  Safety: undefined;
  Profile: undefined;
};
