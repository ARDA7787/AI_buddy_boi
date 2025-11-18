import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { itineraryService } from '../api/services';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Itinerary, ItineraryDay, Activity } from '../types';

interface Props {
  route: any;
  navigation: any;
}

export const ItineraryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    loadItinerary();
  }, [tripId]);

  const loadItinerary = async () => {
    try {
      setError(null);
      const response = await itineraryService.getItinerary(tripId);

      if (response.success && response.data) {
        setItinerary(response.data);
      } else {
        throw new Error(response.error || 'Failed to load itinerary');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  const renderActivity = (activity: Activity) => {
    const categoryColors = {
      activity: '#4CAF50',
      meal: '#FF9800',
      transport: '#2196F3',
      accommodation: '#9C27B0',
    };

    return (
      <View key={activity.id} style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <View
            style={[
              styles.categoryIndicator,
              { backgroundColor: categoryColors[activity.category] },
            ]}
          />
          <View style={styles.activityHeaderText}>
            <Text style={styles.activityTime}>{activity.time}</Text>
            {activity.duration && (
              <Text style={styles.activityDuration}>• {activity.duration}</Text>
            )}
          </View>
        </View>

        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityLocation}>📍 {activity.location}</Text>

        {activity.cost !== undefined && (
          <Text style={styles.activityCost}>💰 ${activity.cost}</Text>
        )}
      </View>
    );
  };

  const renderDay = (day: ItineraryDay) => {
    return (
      <View key={day.day} style={styles.dayContainer}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>Day {day.day}</Text>
          <Text style={styles.dayDate}>
            {new Date(day.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.activitiesContainer}>
          {day.activities.map(renderActivity)}
        </View>
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading itinerary..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadItinerary} />
      </View>
    );
  }

  if (!itinerary) {
    return (
      <View style={styles.container}>
        <Text>No itinerary found</Text>
      </View>
    );
  }

  const currentDay = itinerary.days.find((d) => d.day === selectedDay);

  return (
    <View style={styles.container}>
      {/* Alert Banner */}
      <View style={styles.alertBanner}>
        <Text style={styles.alertText}>
          ⚠️ Weather alert: Light rain expected tomorrow
        </Text>
      </View>

      {/* Day Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
        contentContainerStyle={styles.daySelectorContent}
      >
        {itinerary.days.map((day) => (
          <TouchableOpacity
            key={day.day}
            style={[
              styles.dayTab,
              selectedDay === day.day && styles.dayTabActive,
            ]}
            onPress={() => setSelectedDay(day.day)}
          >
            <Text
              style={[
                styles.dayTabText,
                selectedDay === day.day && styles.dayTabTextActive,
              ]}
            >
              Day {day.day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Day Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {currentDay && renderDay(currentDay)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  alertBanner: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE69C',
  },
  alertText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  daySelector: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    maxHeight: 60,
  },
  daySelectorContent: {
    padding: 12,
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  dayTabActive: {
    backgroundColor: '#007AFF',
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  dayTabTextActive: {
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  dayContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  dayDate: {
    fontSize: 16,
    color: '#666',
  },
  activitiesContainer: {
    gap: 16,
  },
  activityCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  activityHeaderText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activityDuration: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  activityLocation: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  activityCost: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
