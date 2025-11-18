import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAppStore } from '../store';
import { colors, spacing, typography } from '../theme';

type OnboardingNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const setHasCompletedOnboarding = useAppStore(state => state.setHasCompletedOnboarding);

  const handleGetStarted = () => {
    setHasCompletedOnboarding(true);
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to AI Travel Buddy</Text>
        <Text style={styles.subtitle}>Your personal travel assistant powered by AI</Text>

        <View style={styles.featuresList}>
          <Text style={styles.feature}>✈️ Plan your trips with AI assistance</Text>
          <Text style={styles.feature}>📅 Manage your itineraries</Text>
          <Text style={styles.feature}>💬 Chat with your travel buddy</Text>
          <Text style={styles.feature}>🛡️ Stay safe with travel tips</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  featuresList: {
    marginTop: spacing.xl,
  },
  feature: {
    fontSize: typography.fontSizes.md,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
  },
});
