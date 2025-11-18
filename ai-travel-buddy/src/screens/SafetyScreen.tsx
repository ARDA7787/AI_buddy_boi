import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import { useAppStore } from '../store';
import { colors, spacing, typography } from '../theme';
import { EmergencyContact } from '../types';

export const SafetyScreen = () => {
  const activeTripId = useAppStore(state => state.activeTripId);
  const trips = useAppStore(state => state.trips);
  const activeTrip = trips.find(t => t.id === activeTripId);

  // Extract country from destination (simplified)
  const country = activeTrip?.destination.split(',').pop()?.trim() || 'Japan';

  const { data: safetyInfo, isLoading } = useQuery({
    queryKey: ['safetyInfo', country],
    queryFn: () => apiClient.getSafetyInfo(country),
  });

  const handleCallEmergency = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const getEmergencyIcon = (type: EmergencyContact['type']) => {
    switch (type) {
      case 'police':
        return '🚓';
      case 'ambulance':
        return '🚑';
      case 'fire':
        return '🚒';
      case 'embassy':
        return '🏛️';
      default:
        return '📞';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!safetyInfo) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No safety information available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Information</Text>
        <Text style={styles.country}>{safetyInfo.country}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ Travel Warnings</Text>
        {safetyInfo.warnings.map((warning, index) => (
          <View key={index} style={styles.warningCard}>
            <Text style={styles.warningText}>{warning}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚨 Emergency Contacts</Text>
        {safetyInfo.emergencyNumbers.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.emergencyCard}
            onPress={() => handleCallEmergency(contact.number)}
          >
            <View style={styles.emergencyHeader}>
              <Text style={styles.emergencyIcon}>{getEmergencyIcon(contact.type)}</Text>
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyType}>{contact.type.toUpperCase()}</Text>
                {contact.description && (
                  <Text style={styles.emergencyDescription}>{contact.description}</Text>
                )}
              </View>
            </View>
            <Text style={styles.emergencyNumber}>{contact.number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {safetyInfo.healthInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 Health Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{safetyInfo.healthInfo}</Text>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Last updated: {formatDate(safetyInfo.updatedAt)}</Text>
      </View>
    </ScrollView>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
  header: {
    padding: spacing.lg,
    backgroundColor: colors.error,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  country: {
    fontSize: typography.fontSizes.md,
    color: colors.text.inverse,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  warningCard: {
    backgroundColor: colors.card,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  warningText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.primary,
  },
  emergencyCard: {
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
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emergencyIcon: {
    fontSize: typography.fontSizes.xxl,
    marginRight: spacing.md,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyType: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  emergencyDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  emergencyNumber: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
  },
  infoText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.primary,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.relaxed,
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSizes.xs,
    color: colors.text.tertiary,
  },
});
