import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Trip, UserPreferences } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: (complete: boolean) => void;
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const [storedUser, storedOnboarding] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('onboardingComplete'),
      ]);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedOnboarding) {
        setIsOnboardingComplete(JSON.parse(storedOnboarding));
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Persist user data when it changes
  useEffect(() => {
    if (user) {
      AsyncStorage.setItem('user', JSON.stringify(user));
    } else {
      AsyncStorage.removeItem('user');
    }
  }, [user]);

  // Persist onboarding status
  useEffect(() => {
    AsyncStorage.setItem('onboardingComplete', JSON.stringify(isOnboardingComplete));
  }, [isOnboardingComplete]);

  const value = {
    user,
    setUser,
    trips,
    setTrips,
    isOnboardingComplete,
    setIsOnboardingComplete,
    currentTrip,
    setCurrentTrip,
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
