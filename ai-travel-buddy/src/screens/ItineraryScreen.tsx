import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import { RootStackParamList } from '../types';
import { apiClient } from '../api/apiClient';
import { useAppStore } from '../store';
import { colors, spacing, typography } from '../theme';

type ItineraryNavigationProp = StackNavigationProp<RootStackParamList>;

export const ItineraryScreen = () => {
  const navigation = useNavigation<ItineraryNavigationProp>();
  const activeTripId = useAppStore(state => state.activeTripId);

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', activeTripId],
    queryFn: () => (activeTripId ? apiClient.getTripById(activeTripId) : null),
    enabled: !!activeTripId,
  });

  const handleViewAllTrips = () => {
    navigation.navigate('TripList');
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!activeTripId || !trip) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No active trip selected</Text>
        <TouchableOpacity style={styles.button} onPress={handleViewAllTrips}>
          <Text style={styles.buttonText}>View All Trips</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.destination}>{trip.destination}</Text>
        <Text style={styles.dates}>
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </Text>
      </View>

      {trip.itinerary.map(day => (
        <View key={day.id} style={styles.daySection}>
          <Text style={styles.dayTitle}>Day {day.day}</Text>
          <Text style={styles.dayDate}>{formatDate(day.date)}</Text>

          {day.activities.map(activity => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                {activity.startTime && (
                  <Text style={styles.activityTime}>{activity.startTime}</Text>
                )}
              </View>
              {activity.description && (
                <Text style={styles.activityDescription}>{activity.description}</Text>
              )}
              {activity.location && (
                <Text style={styles.activityLocation}>📍 {activity.location.name}</Text>
              )}
              {activity.cost !== undefined && (
                <Text style={styles.activityCost}>💰 ${activity.cost}</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  destination: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  dates: {
    fontSize: typography.fontSizes.md,
    color: colors.text.inverse,
  },
  daySection: {
    padding: spacing.lg,
  },
  dayTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  dayDate: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  activityTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  activityTime: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
  },
  activityDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  activityLocation: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  activityCost: {
    fontSize: typography.fontSizes.sm,
    color: colors.success,
    fontWeight: typography.fontWeights.medium,
  },
  emptyText: {
    fontSize: typography.fontSizes.lg,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
  },
});
