import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import { useAppStore } from '../store';
import { colors, spacing, typography } from '../theme';

export const ProfileScreen = () => {
  const user = useAppStore(state => state.user);
  const preferences = useAppStore(state => state.preferences);
  const setUser = useAppStore(state => state.setUser);
  const setPreferences = useAppStore(state => state.setPreferences);

  useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const data = await apiClient.getCurrentUser();
      setUser(data);
      return data;
    },
  });

  useQuery({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const data = await apiClient.getUserPreferences();
      setPreferences(data);
      return data;
    },
  });

  const stats = [
    { label: 'Trips Planned', value: '3' },
    { label: 'Countries Visited', value: '5' },
    { label: 'Days Traveled', value: '42' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{user?.name.charAt(0) || 'U'}</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{user?.name || 'Loading...'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceCard}>
          <Text style={styles.preferenceLabel}>Theme</Text>
          <Text style={styles.preferenceValue}>{preferences?.theme || 'Light'}</Text>
        </View>
        <View style={styles.preferenceCard}>
          <Text style={styles.preferenceLabel}>Language</Text>
          <Text style={styles.preferenceValue}>{preferences?.language || 'English'}</Text>
        </View>
        <View style={styles.preferenceCard}>
          <Text style={styles.preferenceLabel}>Currency</Text>
          <Text style={styles.preferenceValue}>{preferences?.currency || 'USD'}</Text>
        </View>
        <View style={styles.preferenceCard}>
          <Text style={styles.preferenceLabel}>Notifications</Text>
          <Text style={styles.preferenceValue}>
            {preferences?.notifications ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Edit Profile</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Settings</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Help & Support</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Privacy Policy</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.inverse,
  },
  name: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.fontSizes.md,
    color: colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
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
  preferenceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  preferenceLabel: {
    fontSize: typography.fontSizes.md,
    color: colors.text.primary,
  },
  preferenceValue: {
    fontSize: typography.fontSizes.md,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  menuItemText: {
    fontSize: typography.fontSizes.md,
    color: colors.text.primary,
  },
  menuItemArrow: {
    fontSize: typography.fontSizes.xl,
    color: colors.text.tertiary,
  },
  logoutButton: {
    margin: spacing.lg,
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.text.inverse,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
  },
});
