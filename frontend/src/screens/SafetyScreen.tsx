/**
 * Safety and emergency information screen
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { api } from '../services/api';
import type { SafetyInfo } from '../types';

export default function SafetyScreen() {
  const { currentTrip } = useStore();
  const [safetyInfo, setSafetyInfo] = useState<SafetyInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentTrip) {
      loadSafetyInfo();
    }
  }, [currentTrip]);

  const loadSafetyInfo = async () => {
    if (!currentTrip?.metadata?.coordinates) return;

    try {
      const data = await api.getSafetyInfo(
        currentTrip.metadata.coordinates.lat,
        currentTrip.metadata.coordinates.lng,
        currentTrip.destination
      );
      setSafetyInfo(data);
    } catch (error) {
      console.error('Failed to load safety info', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSafetyInfo();
    setRefreshing(false);
  };

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const getSafetyLevelColor = (level: string) => {
    switch (level) {
      case 'safe':
        return '#34C759';
      case 'moderate':
        return '#FFA500';
      case 'caution':
        return '#FF9500';
      case 'danger':
        return '#FF3B30';
      default:
        return '#999';
    }
  };

  const getSafetyLevelIcon = (level: string) => {
    switch (level) {
      case 'safe':
        return 'checkmark-circle';
      case 'moderate':
        return 'information-circle';
      case 'caution':
        return 'warning';
      case 'danger':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  if (!currentTrip) {
    return (
      <View style={styles.noTripContainer}>
        <Ionicons name="shield-checkmark-outline" size={64} color="#ccc" />
        <Text style={styles.noTripText}>Select a trip to view safety information</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety & Emergency</Text>
        <Text style={styles.headerSubtitle}>{currentTrip.destination}</Text>
      </View>

      {safetyInfo && (
        <>
          {/* Safety Score */}
          <View style={styles.section}>
            <View style={styles.safetyScoreContainer}>
              <View style={[styles.safetyScoreCircle, { borderColor: getSafetyLevelColor(safetyInfo.safety_score.level) }]}>
                <Text style={[styles.safetyScoreNumber, { color: getSafetyLevelColor(safetyInfo.safety_score.level) }]}>
                  {safetyInfo.safety_score.score.toFixed(1)}
                </Text>
                <Text style={styles.safetyScoreOutOf}>/10</Text>
              </View>
              <View style={styles.safetyScoreInfo}>
                <View style={[styles.safetyLevelBadge, { backgroundColor: getSafetyLevelColor(safetyInfo.safety_score.level) }]}>
                  <Ionicons
                    name={getSafetyLevelIcon(safetyInfo.safety_score.level) as any}
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.safetyLevelText}>
                    {safetyInfo.safety_score.level.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.safetyDescription}>Current safety rating for {currentTrip.destination}</Text>
              </View>
            </View>
          </View>

          {/* Safety Tips */}
          {safetyInfo.safety_score.tips && safetyInfo.safety_score.tips.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Safety Tips</Text>
              <View style={styles.tipsContainer}>
                {safetyInfo.safety_score.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Emergency Contacts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Numbers</Text>
            <View style={styles.emergencyGrid}>
              <TouchableOpacity
                style={styles.emergencyCard}
                onPress={() => handleCall(safetyInfo.safety_score.emergency_numbers.police)}
              >
                <Ionicons name="shield" size={32} color="#007AFF" />
                <Text style={styles.emergencyLabel}>Police</Text>
                <Text style={styles.emergencyNumber}>{safetyInfo.safety_score.emergency_numbers.police}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emergencyCard}
                onPress={() => handleCall(safetyInfo.safety_score.emergency_numbers.ambulance)}
              >
                <Ionicons name="medical" size={32} color="#FF3B30" />
                <Text style={styles.emergencyLabel}>Ambulance</Text>
                <Text style={styles.emergencyNumber}>{safetyInfo.safety_score.emergency_numbers.ambulance}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emergencyCard}
                onPress={() => handleCall(safetyInfo.safety_score.emergency_numbers.fire)}
              >
                <Ionicons name="flame" size={32} color="#FFA500" />
                <Text style={styles.emergencyLabel}>Fire</Text>
                <Text style={styles.emergencyNumber}>{safetyInfo.safety_score.emergency_numbers.fire}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nearest Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearest Services</Text>

            <View style={styles.serviceCard}>
              <View style={styles.serviceIcon}>
                <Ionicons name="medical" size={24} color="#fff" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{safetyInfo.safety_score.nearest_hospital.name}</Text>
                <Text style={styles.serviceAddress}>{safetyInfo.safety_score.nearest_hospital.address}</Text>
                <Text style={styles.serviceDistance}>{safetyInfo.safety_score.nearest_hospital.distance_km} km away</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(safetyInfo.safety_score.nearest_hospital.phone)}
              >
                <Ionicons name="call" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.serviceCard}>
              <View style={[styles.serviceIcon, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="shield" size={24} color="#fff" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{safetyInfo.safety_score.nearest_police.name}</Text>
                <Text style={styles.serviceAddress}>{safetyInfo.safety_score.nearest_police.address}</Text>
                <Text style={styles.serviceDistance}>{safetyInfo.safety_score.nearest_police.distance_km} km away</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(safetyInfo.safety_score.nearest_police.phone)}
              >
                <Ionicons name="call" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Alerts */}
          {safetyInfo.active_alerts && safetyInfo.active_alerts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Alerts</Text>
              {safetyInfo.active_alerts.map((alert: any, index: number) => (
                <View key={index} style={styles.activeAlert}>
                  <Ionicons name="warning" size={20} color="#FFA500" />
                  <Text style={styles.activeAlertText}>{alert.message}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  safetyScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  safetyScoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyScoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  safetyScoreOutOf: {
    fontSize: 14,
    color: '#999',
  },
  safetyScoreInfo: {
    flex: 1,
  },
  safetyLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginBottom: 8,
  },
  safetyLevelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  safetyDescription: {
    fontSize: 14,
    color: '#666',
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emergencyGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  emergencyCard: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  emergencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emergencyNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceAddress: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  serviceDistance: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  activeAlertText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  noTripContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  noTripText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});
