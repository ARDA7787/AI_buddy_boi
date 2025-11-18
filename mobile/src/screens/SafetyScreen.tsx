import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Alert,
} from 'react-native';
import { safetyService } from '../api/services';
import { SafetyInfo, Alert as SafetyAlert } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const SafetyScreen: React.FC = () => {
  const [safetyInfo, setSafetyInfo] = useState<SafetyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSafetyInfo();
  }, []);

  const loadSafetyInfo = async () => {
    try {
      setError(null);
      const response = await safetyService.getSafetyInfo();

      if (response.success && response.data) {
        setSafetyInfo(response.data);
      } else {
        throw new Error(response.error || 'Failed to load safety info');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load safety info');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadSafetyInfo();
  };

  const handleEmergencyCall = (number: string, name: string) => {
    Alert.alert(`Call ${name}?`, `Dial ${number}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => Linking.openURL(`tel:${number}`),
      },
    ]);
  };

  const handleReportEmergency = () => {
    Alert.alert(
      'Report Emergency',
      'This will notify emergency contacts and authorities.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: async () => {
            try {
              await safetyService.reportEmergency('general', 'Emergency reported via app');
              Alert.alert('Emergency reported', 'Help is on the way');
            } catch (error) {
              Alert.alert('Error', 'Failed to report emergency');
            }
          },
        },
      ]
    );
  };

  const renderAlert = (alert: SafetyAlert) => {
    const severityColors = {
      low: '#FFF3CD',
      medium: '#FFE69C',
      high: '#F8D7DA',
    };

    const severityBorderColors = {
      low: '#FFE69C',
      medium: '#FFC107',
      high: '#DC3545',
    };

    const severityIcons = {
      low: 'ℹ️',
      medium: '⚠️',
      high: '🚨',
    };

    return (
      <View
        key={alert.id}
        style={[
          styles.alertCard,
          {
            backgroundColor: severityColors[alert.severity],
            borderLeftColor: severityBorderColors[alert.severity],
          },
        ]}
      >
        <View style={styles.alertHeader}>
          <Text style={styles.alertIcon}>{severityIcons[alert.severity]}</Text>
          <View style={styles.alertHeaderText}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertType}>
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.alertMessage}>{alert.message}</Text>
        <Text style={styles.alertTimestamp}>
          {new Date(alert.timestamp).toLocaleString()}
        </Text>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading safety info..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadSafetyInfo} />
      </View>
    );
  }

  if (!safetyInfo) {
    return (
      <View style={styles.container}>
        <Text>No safety information available</Text>
      </View>
    );
  }

  const statusColors = {
    safe: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
  };

  const statusIcons = {
    safe: '✅',
    warning: '⚠️',
    danger: '🚨',
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Status Card */}
      <View
        style={[
          styles.statusCard,
          { backgroundColor: statusColors[safetyInfo.status] },
        ]}
      >
        <Text style={styles.statusIcon}>{statusIcons[safetyInfo.status]}</Text>
        <Text style={styles.statusText}>
          {safetyInfo.status === 'safe'
            ? 'You are safe'
            : safetyInfo.status === 'warning'
            ? 'Stay alert'
            : 'Immediate attention needed'}
        </Text>
      </View>

      {/* Current Location */}
      {safetyInfo.currentLocation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationText}>
              📍 {safetyInfo.currentLocation}
            </Text>
          </View>
        </View>
      )}

      {/* Emergency Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Actions</Text>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleReportEmergency}
        >
          <Text style={styles.emergencyButtonText}>🚨 Report Emergency</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.emergencyButton, styles.shareLocationButton]}
          onPress={() => Alert.alert('Share Location', 'Feature coming soon')}
        >
          <Text style={styles.emergencyButtonText}>📍 Share Location</Text>
        </TouchableOpacity>
      </View>

      {/* Alerts */}
      {safetyInfo.alerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Alerts</Text>
          {safetyInfo.alerts.map(renderAlert)}
        </View>
      )}

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {safetyInfo.emergencyContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactCard}
            onPress={() => handleEmergencyCall(contact.number, contact.name)}
          >
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactType}>
                {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
              </Text>
            </View>
            <Text style={styles.contactNumber}>{contact.number}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
  },
  statusCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  locationCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    color: '#000',
  },
  emergencyButton: {
    backgroundColor: '#DC3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  shareLocationButton: {
    backgroundColor: '#007AFF',
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  alertCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertHeaderText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  alertType: {
    fontSize: 12,
    color: '#666',
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  contactCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  contactType: {
    fontSize: 14,
    color: '#666',
  },
  contactNumber: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
