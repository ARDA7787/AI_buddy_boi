import { apiClient } from './config';
import {
  User,
  UserPreferences,
  Trip,
  Itinerary,
  Message,
  SafetyInfo,
  ApiResponse,
} from '../types';

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/login', { email, password });
  },

  register: async (email: string, password: string, name: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/register', { email, password, name });
  },

  savePreferences: async (preferences: UserPreferences): Promise<ApiResponse<User>> => {
    return apiClient.post('/auth/preferences', preferences);
  },
};

// Trip Services
export const tripService = {
  getAllTrips: async (): Promise<ApiResponse<Trip[]>> => {
    return apiClient.get('/trips');
  },

  getTripById: async (id: string): Promise<ApiResponse<Trip>> => {
    return apiClient.get(`/trips/${id}`);
  },

  createTrip: async (tripData: Partial<Trip>): Promise<ApiResponse<Trip>> => {
    return apiClient.post('/trips', tripData);
  },
};

// Itinerary Services
export const itineraryService = {
  getItinerary: async (tripId: string): Promise<ApiResponse<Itinerary>> => {
    return apiClient.get(`/itineraries/${tripId}`);
  },

  updateItinerary: async (tripId: string, itinerary: Partial<Itinerary>): Promise<ApiResponse<Itinerary>> => {
    return apiClient.put(`/itineraries/${tripId}`, itinerary);
  },
};

// Chat Services
export const chatService = {
  sendMessage: async (message: string, tripId?: string): Promise<ApiResponse<Message>> => {
    return apiClient.post('/chat/message', { message, tripId });
  },

  getChatHistory: async (tripId?: string): Promise<ApiResponse<Message[]>> => {
    return apiClient.get(`/chat/history${tripId ? `?tripId=${tripId}` : ''}`);
  },
};

// Safety Services
export const safetyService = {
  getSafetyInfo: async (tripId?: string): Promise<ApiResponse<SafetyInfo>> => {
    return apiClient.get(`/safety${tripId ? `?tripId=${tripId}` : ''}`);
  },

  reportEmergency: async (type: string, details: string): Promise<ApiResponse<void>> => {
    return apiClient.post('/safety/emergency', { type, details });
  },
};
