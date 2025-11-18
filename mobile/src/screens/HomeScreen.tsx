import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { tripService } from '../api/services';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Trip } from '../types';

interface Props {
  navigation: any;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { trips, setTrips, setCurrentTrip, user } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setError(null);
      const response = await tripService.getAllTrips();

      if (response.success && response.data) {
        setTrips(response.data);
      } else {
        throw new Error(response.error || 'Failed to load trips');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load trips');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  const handleTripPress = (trip: Trip) => {
    setCurrentTrip(trip);
    navigation.navigate('Itinerary', { tripId: trip.id });
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading your trips..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'Traveler'}!</Text>
        <Text style={styles.subtitle}>Ready for your next adventure?</Text>
      </View>

      {error && <ErrorMessage message={error} onRetry={loadTrips} />}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Trips</Text>

          {trips.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No trips yet</Text>
              <Text style={styles.emptySubtext}>
                Start planning your first adventure!
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('Chat')}
              >
                <Text style={styles.createButtonText}>Plan a Trip</Text>
              </TouchableOpacity>
            </View>
          ) : (
            trips.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                style={styles.tripCard}
                onPress={() => handleTripPress(trip)}
              >
                <View style={styles.tripImageContainer}>
                  <View style={styles.tripImagePlaceholder}>
                    <Text style={styles.tripImageText}>
                      {trip.destination.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.tripInfo}>
                  <Text style={styles.tripDestination}>{trip.destination}</Text>
                  <Text style={styles.tripDates}>
                    {new Date(trip.startDate).toLocaleDateString()} -{' '}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </Text>
                  {trip.description && (
                    <Text style={styles.tripDescription} numberOfLines={2}>
                      {trip.description}
                    </Text>
                  )}

                  <View style={styles.tripFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        trip.status === 'active' && styles.statusActive,
                        trip.status === 'upcoming' && styles.statusUpcoming,
                        trip.status === 'completed' && styles.statusCompleted,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripImageContainer: {
    width: 100,
  },
  tripImagePlaceholder: {
    width: 100,
    height: '100%',
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripImageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  tripInfo: {
    flex: 1,
    padding: 16,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tripDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  tripFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusUpcoming: {
    backgroundColor: '#E3F2FD',
  },
  statusCompleted: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
