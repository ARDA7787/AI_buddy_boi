/**
 * Trip list screen (main dashboard)
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useStore } from '../store';
import { api } from '../services/api';
import type { Trip } from '../types';

export default function TripListScreen({ navigation }: any) {
  const { trips, setTrips, setCurrentTrip } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await api.getTrips();
      setTrips(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load trips');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

  const handleTripPress = (trip: Trip) => {
    setCurrentTrip(trip);
    navigation.navigate('TripDetail', { tripId: trip.id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return '#FFA500';
      case 'in_progress':
        return '#007AFF';
      case 'completed':
        return '#34C759';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return 'create-outline';
      case 'in_progress':
        return 'airplane';
      case 'completed':
        return 'checkmark-circle';
      default:
        return 'alert-circle-outline';
    }
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => handleTripPress(item)}
    >
      <View style={styles.tripHeader}>
        <Text style={styles.tripDestination}>{item.destination}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={14}
            color="#fff"
          />
          <Text style={styles.statusText}>
            {item.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.tripDetailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.tripDetailText}>
            {format(new Date(item.start_date), 'MMM d')} - {format(new Date(item.end_date), 'MMM d, yyyy')}
          </Text>
        </View>

        {item.total_budget && (
          <View style={styles.tripDetailRow}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={styles.tripDetailText}>
              ${item.total_budget} budget
            </Text>
          </View>
        )}

        <View style={styles.tripDetailRow}>
          <Ionicons name="list-outline" size={16} color="#666" />
          <Text style={styles.tripDetailText}>
            {item.days?.length || 0} days, {item.days?.reduce((acc, day) => acc + (day.activities?.length || 0), 0) || 0} activities
          </Text>
        </View>
      </View>

      {item.alerts && item.alerts.length > 0 && (
        <View style={styles.alertsContainer}>
          <Ionicons name="warning" size={16} color="#FFA500" />
          <Text style={styles.alertsText}>
            {item.alerts.length} active alert{item.alerts.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateTrip')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {trips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="airplane-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptyText}>
            Start planning your next adventure!
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateTrip')}
          >
            <Text style={styles.createButtonText}>Plan New Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={trips}
          renderItem={renderTripCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDestination: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  tripDetails: {
    gap: 8,
  },
  tripDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripDetailText: {
    fontSize: 14,
    color: '#666',
  },
  alertsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  alertsText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
