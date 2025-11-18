import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';
import { ItineraryScreen, ChatScreen, SafetyScreen, ProfileScreen } from '../screens';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text.primary,
      }}
    >
      <Tab.Screen
        name="Itinerary"
        component={ItineraryScreen}
        options={{
          tabBarLabel: 'Itinerary',
          tabBarIcon: () => '📅',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: () => '💬',
          title: 'AI Travel Buddy',
        }}
      />
      <Tab.Screen
        name="Safety"
        component={SafetyScreen}
        options={{
          tabBarLabel: 'Safety',
          tabBarIcon: () => '🛡️',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => '👤',
        }}
      />
    </Tab.Navigator>
  );
};
