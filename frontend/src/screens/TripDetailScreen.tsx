/**
 * Trip detail screen with dynamic itinerary
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useStore } from '../store';
import { api } from '../services/api';
import type { Day, Activity, Alert as AlertType } from '../types';

const CATEGORY_ICONS: Record<string, string> = {
  food: 'restaurant',
  museum: 'business',
  sightseeing: 'eye',
  shopping: 'cart',
  nightlife: 'musical-notes',
  outdoor: 'leaf',
  cultural: 'color-palette',
  relaxation: 'spa',
  transport: 'car',
  accommodation: 'bed',
  other: 'ellipse',
};

const CATEGORY_COLORS: Record<string, string> = {
  food: '#FF6B6B',
  museum: '#4ECDC4',
  sightseeing: '#45B7D1',
  shopping: '#FFA07A',
  nightlife: '#9D4EDD',
  outdoor: '#06D6A0',
  cultural: '#F78C6B',
  relaxation: '#83C5BE',
  transport: '#FFD166',
  accommodation: '#118AB2',
  other: '#999',
};

export default function TripDetailScreen({ route, navigation }: any) {
  const { tripId } = route.params;
  const { currentTrip, setCurrentTrip } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  useEffect(() => {
    loadTrip();
    loadAlerts();
  }, [tripId]);

  const loadTrip = async () => {
    try {
      const trip = await api.getTrip(tripId);
      setCurrentTrip(trip);
    } catch (error) {
      Alert.alert('Error', 'Failed to load trip');
    }
  };

  const loadAlerts = async () => {
    try {
      const data = await api.getTripAlerts(tripId);
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load alerts', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTrip();
    await loadAlerts();
    setRefreshing(false);
  };

  const renderActivity = (activity: Activity) => {
    const categoryColor = CATEGORY_COLORS[activity.category] || '#999';
    const categoryIcon = (CATEGORY_ICONS[activity.category] || 'ellipse') as keyof typeof Ionicons.glyphMap;

    return (
      <View key={activity.id} style={styles.activityCard}>
        <View style={[styles.activityIconContainer, { backgroundColor: categoryColor }]}>
          <Ionicons name={categoryIcon} size={20} color="#fff" />
        </View>

        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTime}>
              {format(new Date(activity.start_time), 'h:mm a')} - {format(new Date(activity.end_time), 'h:mm a')}
            </Text>
            {activity.cost_estimate && (
              <Text style={styles.activityCost}>${activity.cost_estimate}</Text>
            )}
          </View>

          <Text style={styles.activityTitle}>{activity.title}</Text>

          {activity.description && (
            <Text style={styles.activityDescription}>{activity.description}</Text>
          )}

          {activity.location && (
            <View style={styles.activityLocation}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.activityLocationText}>{activity.location}</Text>
            </View>
          )}

          {activity.metadata?.tips && (
            <View style={styles.activityTips}>
              <Ionicons name="bulb-outline" size={14} color="#FFA500" />
              <Text style={styles.activityTipsText}>{activity.metadata.tips}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderDay = (day: Day) => (
    <View key={day.id} style={styles.daySection}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>Day {day.index}</Text>
        <Text style={styles.dayDate}>{format(new Date(day.date), 'MMM d, yyyy')}</Text>
      </View>

      {day.activities && day.activities.length > 0 ? (
        <View style={styles.activitiesContainer}>
          {day.activities.map(renderActivity)}
        </View>
      ) : (
        <Text style={styles.noActivities}>No activities planned for this day</Text>
      )}
    </View>
  );

  const renderAlert = (alert: AlertType) => {
    const severityColor = alert.severity === 'critical' ? '#FF3B30' :
                          alert.severity === 'warning' ? '#FFA500' : '#007AFF';

    return (
      <View key={alert.id} style={[styles.alertBanner, { borderLeftColor: severityColor }]}>
        <Ionicons
          name={alert.severity === 'critical' ? 'warning' : 'information-circle'}
          size={24}
          color={severityColor}
        />
        <View style={styles.alertContent}>
          <Text style={styles.alertMessage}>{alert.message}</Text>
          {alert.alternatives && alert.alternatives.length > 0 && (
            <TouchableOpacity style={styles.alertButton}>
              <Text style={styles.alertButtonText}>View Alternatives</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (!currentTrip) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.destination}>{currentTrip.destination}</Text>
        <Text style={styles.dates}>
          {format(new Date(currentTrip.start_date), 'MMM d')} - {format(new Date(currentTrip.end_date), 'MMM d, yyyy')}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Alerts */}
        {alerts.length > 0 && (
          <View style={styles.alertsSection}>
            {alerts.map(renderAlert)}
          </View>
        )}

        {/* Days and Activities */}
        {currentTrip.days && currentTrip.days.length > 0 ? (
          currentTrip.days.map(renderDay)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No itinerary yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Ionicons name="chatbubbles-outline" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Safety')}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Safety</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  destination: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dates: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  alertsSection: {
    padding: 16,
    gap: 12,
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  alertButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  alertButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayDate: {
    fontSize: 14,
    color: '#fff',
  },
  activitiesContainer: {
    padding: 16,
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activityCost: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  activityLocationText: {
    fontSize: 12,
    color: '#666',
  },
  activityTips: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF9E6',
    borderRadius: 6,
  },
  activityTipsText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  noActivities: {
    padding: 16,
    textAlign: 'center',
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
