import { create } from 'zustand';
import { User, UserPreferences, Trip } from '../types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Preferences state
  preferences: UserPreferences | null;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;

  // Trips state
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  removeTrip: (tripId: string) => void;

  // Active trip state
  activeTripId: string | null;
  setActiveTripId: (tripId: string | null) => void;

  // Onboarding state
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

export const useAppStore = create<AppState>(set => ({
  // User state
  user: null,
  setUser: user => set({ user }),

  // Preferences state
  preferences: null,
  setPreferences: preferences => set({ preferences }),
  updatePreferences: updates =>
    set(state => ({
      preferences: state.preferences ? { ...state.preferences, ...updates } : null,
    })),

  // Trips state
  trips: [],
  setTrips: trips => set({ trips }),
  addTrip: trip => set(state => ({ trips: [...state.trips, trip] })),
  updateTrip: (tripId, updates) =>
    set(state => ({
      trips: state.trips.map(trip => (trip.id === tripId ? { ...trip, ...updates } : trip)),
    })),
  removeTrip: tripId => set(state => ({ trips: state.trips.filter(trip => trip.id !== tripId) })),

  // Active trip state
  activeTripId: null,
  setActiveTripId: activeTripId => set({ activeTripId }),

  // Onboarding state
  hasCompletedOnboarding: false,
  setHasCompletedOnboarding: completed => set({ hasCompletedOnboarding: completed }),
}));
