/**
 * Create trip screen with itinerary generation
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useStore } from '../store';
import { api } from '../services/api';

export default function CreateTripScreen({ navigation }: any) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [constraints, setConstraints] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, addTrip, setCurrentTrip } = useStore();

  const handleCreateTrip = async () => {
    if (!destination || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill in destination and dates');
      return;
    }

    // Basic date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      Alert.alert('Error', 'Please enter valid dates (YYYY-MM-DD)');
      return;
    }
    if (end <= start) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      const trip = await api.createAndGenerateTrip({
        destination,
        start_date: startDate,
        end_date: endDate,
        budget: budget ? parseFloat(budget) : undefined,
        interests: user?.preferences?.interests || [],
        travel_style: user?.preferences?.travel_style || 'balanced',
        constraints: constraints || undefined,
      });

      addTrip(trip);
      setCurrentTrip(trip);

      Alert.alert(
        'Success!',
        'Your trip itinerary has been generated',
        [
          {
            text: 'View Itinerary',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'Main' },
                  { name: 'TripDetail', params: { tripId: trip.id } },
                ],
              });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Generating your personalized itinerary...</Text>
        <Text style={styles.loadingSubtext}>
          Our AI is analyzing {destination} to create the perfect trip for you
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Plan Your Trip</Text>
      <Text style={styles.subtitle}>
        Tell us where you want to go, and our AI will create a personalized itinerary
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Destination *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Paris, Tokyo, New York"
          value={destination}
          onChangeText={setDestination}
        />

        <Text style={styles.label}>Start Date * (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-06-01"
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={styles.label}>End Date * (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-06-07"
          value={endDate}
          onChangeText={setEndDate}
        />

        <Text style={styles.label}>Total Budget (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 1500"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Special Requests (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g., slow mornings, vegetarian food, nightlife, photography spots"
          value={constraints}
          onChangeText={setConstraints}
          multiline
          numberOfLines={4}
        />

        <View style={styles.preferencesCard}>
          <Text style={styles.preferencesTitle}>Your Preferences</Text>
          <Text style={styles.preferencesText}>
            Travel Style: {user?.preferences?.travel_style || 'Not set'}
          </Text>
          <Text style={styles.preferencesText}>
            Interests: {user?.preferences?.interests?.join(', ') || 'Not set'}
          </Text>
          <Text style={styles.preferencesText}>
            Budget: ${user?.preferences?.budget_per_day || 100}/day
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateTrip}
        >
          <Text style={styles.buttonText}>Generate Itinerary</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  preferencesCard: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  preferencesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
});
