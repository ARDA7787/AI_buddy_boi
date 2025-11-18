import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { OnboardingScreen, TripListScreen } from '../screens';
import { TabNavigator } from './TabNavigator';
import { useAppStore } from '../store';
import { colors } from '../theme';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const hasCompletedOnboarding = useAppStore(state => state.hasCompletedOnboarding);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasCompletedOnboarding ? 'Main' : 'Onboarding'}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text.primary,
        }}
      >
        {!hasCompletedOnboarding && (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="TripList" component={TripListScreen} options={{ title: 'My Trips' }} />
        <Stack.Screen
          name="TripDetail"
          component={TripListScreen}
          options={{ title: 'Trip Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
