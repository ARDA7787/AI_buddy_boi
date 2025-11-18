/**
 * Global state management using Zustand
 */
import { create } from 'zustand';
import type { User, Trip, Message } from '../types';

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;

  // Trip state
  trips: Trip[];
  currentTrip: Trip | null;
  setTrips: (trips: Trip[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  removeTrip: (tripId: number) => void;

  // Chat state
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;

  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Actions
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  trips: [],
  currentTrip: null,
  messages: [],
  isLoading: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setTrips: (trips) => set({ trips }),

  setCurrentTrip: (trip) => set({ currentTrip: trip }),

  addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),

  updateTrip: (trip) => set((state) => ({
    trips: state.trips.map((t) => (t.id === trip.id ? trip : t)),
    currentTrip: state.currentTrip?.id === trip.id ? trip : state.currentTrip,
  })),

  removeTrip: (tripId) => set((state) => ({
    trips: state.trips.filter((t) => t.id !== tripId),
    currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip,
  })),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  setIsLoading: (loading) => set({ isLoading: loading }),

  reset: () => set({
    user: null,
    isAuthenticated: false,
    trips: [],
    currentTrip: null,
    messages: [],
    isLoading: false,
  }),
}));
