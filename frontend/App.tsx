/**
 * AI Travel Buddy - Main App Component
 */
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { useStore } from './src/store';
import { api } from './src/services/api';

export default function App() {
  const { setUser } = useStore();

  useEffect(() => {
    // Try to load user from stored token
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await api.getCurrentUser();
      setUser(user);
    } catch (error) {
      // User not logged in or token expired
      console.log('No active session');
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
