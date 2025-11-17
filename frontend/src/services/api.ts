/**
 * API client for the AI Travel Buddy backend
 */
import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  User,
  Trip,
  Message,
  SafetyInfo,
  AuthResponse,
  CreateTripRequest,
  GenerateItineraryRequest,
  Alert,
} from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Change to your backend URL

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      async (config) => {
        if (!this.token) {
          this.token = await AsyncStorage.getItem('access_token');
        }
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          await this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Set token manually (after login)
  setToken(token: string) {
    this.token = token;
  }

  // Auth endpoints
  async signup(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/signup', {
      email,
      password,
      name,
    });
    this.setToken(response.data.access_token);
    await AsyncStorage.setItem('access_token', response.data.access_token);
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    this.setToken(response.data.access_token);
    await AsyncStorage.setItem('access_token', response.data.access_token);
    return response.data;
  }

  async logout() {
    this.token = null;
    await AsyncStorage.removeItem('access_token');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  async updateUser(data: Partial<User>): Promise<User> {
    const response = await this.client.patch<User>('/auth/me', data);
    return response.data;
  }

  async updatePreferences(preferences: any): Promise<User> {
    const response = await this.client.patch<User>('/auth/me/preferences', preferences);
    return response.data;
  }

  // Trip endpoints
  async getTrips(): Promise<Trip[]> {
    const response = await this.client.get<Trip[]>('/trips');
    return response.data;
  }

  async getTrip(tripId: number): Promise<Trip> {
    const response = await this.client.get<Trip>(`/trips/${tripId}`);
    return response.data;
  }

  async createTrip(data: CreateTripRequest): Promise<Trip> {
    const response = await this.client.post<Trip>('/trips', data);
    return response.data;
  }

  async updateTrip(tripId: number, data: Partial<Trip>): Promise<Trip> {
    const response = await this.client.patch<Trip>(`/trips/${tripId}`, data);
    return response.data;
  }

  async deleteTrip(tripId: number): Promise<void> {
    await this.client.delete(`/trips/${tripId}`);
  }

  async generateItinerary(tripId: number): Promise<Trip> {
    const response = await this.client.post<Trip>(`/trips/${tripId}/generate-itinerary`);
    return response.data;
  }

  async createAndGenerateTrip(data: GenerateItineraryRequest): Promise<Trip> {
    const response = await this.client.post<Trip>('/trips/generate', data);
    return response.data;
  }

  // Chat endpoints
  async getMessages(tripId: number, limit: number = 50): Promise<Message[]> {
    const response = await this.client.get<Message[]>(`/chat/trips/${tripId}/messages`, {
      params: { limit },
    });
    return response.data;
  }

  async sendMessage(tripId: number, message: string): Promise<{ message: Message; suggested_actions: any[] }> {
    const response = await this.client.post('/chat', {
      trip_id: tripId,
      message,
    });
    return response.data;
  }

  // Safety endpoints
  async getSafetyInfo(latitude: number, longitude: number, locationName: string): Promise<SafetyInfo> {
    const response = await this.client.get<SafetyInfo>('/safety/location', {
      params: {
        latitude,
        longitude,
        location_name: locationName,
      },
    });
    return response.data;
  }

  async getTripAlerts(tripId: number): Promise<Alert[]> {
    const response = await this.client.get<Alert[]>(`/safety/trips/${tripId}/alerts`);
    return response.data;
  }

  async resolveAlert(tripId: number, alertId: number): Promise<Alert> {
    const response = await this.client.post<Alert>(`/safety/trips/${tripId}/alerts/${alertId}/resolve`);
    return response.data;
  }
}

export const api = new ApiClient();
