import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import { RootStackParamList, Trip } from '../types';
import { apiClient } from '../api/apiClient';
import { useAppStore } from '../store';
import { colors, spacing, typography } from '../theme';

type TripListNavigationProp = StackNavigationProp<RootStackParamList, 'TripList'>;

export const TripListScreen = () => {
  const navigation = useNavigation<TripListNavigationProp>();
  const setTrips = useAppStore(state => state.setTrips);
  const setActiveTripId = useAppStore(state => state.setActiveTripId);

  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const data = await apiClient.getTrips();
      setTrips(data);
      return data;
    },
  });

  const handleTripPress = (trip: Trip) => {
    setActiveTripId(trip.id);
    navigation.navigate('TripDetail', { tripId: trip.id });
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => handleTripPress(item)}>
      <View style={styles.tripHeader}>
        <Text style={styles.destination}>{item.destination}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.dates}>
        {formatDate(item.startDate)} - {formatDate(item.endDate)}
      </Text>
      {item.budget && <Text style={styles.budget}>Budget: ${item.budget}</Text>}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Trips</Text>
      <FlatList
        data={trips}
        renderItem={renderTripItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips yet. Start planning your adventure!</Text>
          </View>
        }
      />
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planned':
      return colors.info;
    case 'ongoing':
      return colors.success;
    case 'completed':
      return colors.text.tertiary;
    default:
      return colors.text.tertiary;
  }
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
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    padding: spacing.lg,
  },
  list: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  tripCard: {
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
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  destination: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  statusText: {
    color: colors.text.inverse,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    textTransform: 'capitalize',
  },
  dates: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  budget: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
