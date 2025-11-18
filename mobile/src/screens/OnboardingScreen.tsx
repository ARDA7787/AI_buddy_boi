import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { authService } from '../api/services';
import { UserPreferences } from '../types';

const INTERESTS = [
  'Culture',
  'Food',
  'Adventure',
  'Nature',
  'History',
  'Shopping',
  'Beach',
  'Nightlife',
];

const ACCOMMODATION_TYPES = ['Hotel', 'Hostel', 'Airbnb', 'Resort', 'Camping'];

const DIETARY_RESTRICTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
];

export const OnboardingScreen: React.FC = () => {
  const { setUser, setIsOnboardingComplete } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Preferences state
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('medium');
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState<'relaxed' | 'moderate' | 'adventurous'>('moderate');
  const [accommodationType, setAccommodationType] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(['None']);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleAccommodation = (type: string) => {
    setAccommodationType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (interests.length === 0) {
      Alert.alert('Please select at least one interest');
      return;
    }

    if (accommodationType.length === 0) {
      Alert.alert('Please select at least one accommodation type');
      return;
    }

    setLoading(true);
    try {
      const preferences: UserPreferences = {
        budget,
        interests,
        travelStyle,
        accommodationType,
        dietaryRestrictions,
      };

      const response = await authService.savePreferences(preferences);

      if (response.success && response.data) {
        setUser(response.data);
        setIsOnboardingComplete(true);
      } else {
        throw new Error(response.error || 'Failed to save preferences');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your budget preference?</Text>
            <Text style={styles.stepDescription}>
              This helps us recommend suitable activities and accommodations
            </Text>

            <View style={styles.budgetContainer}>
              {(['low', 'medium', 'high'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.budgetOption,
                    budget === level && styles.budgetOptionSelected,
                  ]}
                  onPress={() => setBudget(level)}
                >
                  <Text
                    style={[
                      styles.budgetText,
                      budget === level && styles.budgetTextSelected,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What are your interests?</Text>
            <Text style={styles.stepDescription}>Select all that apply</Text>

            <View style={styles.chipContainer}>
              {INTERESTS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.chip,
                    interests.includes(interest) && styles.chipSelected,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      interests.includes(interest) && styles.chipTextSelected,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your travel style?</Text>
            <Text style={styles.stepDescription}>
              How do you prefer to pace your trips?
            </Text>

            <View style={styles.budgetContainer}>
              {(['relaxed', 'moderate', 'adventurous'] as const).map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.budgetOption,
                    travelStyle === style && styles.budgetOptionSelected,
                  ]}
                  onPress={() => setTravelStyle(style)}
                >
                  <Text
                    style={[
                      styles.budgetText,
                      travelStyle === style && styles.budgetTextSelected,
                    ]}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.stepTitle, { marginTop: 32 }]}>
              Preferred Accommodation
            </Text>
            <View style={styles.chipContainer}>
              {ACCOMMODATION_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    accommodationType.includes(type) && styles.chipSelected,
                  ]}
                  onPress={() => toggleAccommodation(type)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      accommodationType.includes(type) && styles.chipTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Dietary Restrictions</Text>
            <Text style={styles.stepDescription}>
              Help us recommend suitable restaurants
            </Text>

            <View style={styles.chipContainer}>
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <TouchableOpacity
                  key={restriction}
                  style={[
                    styles.chip,
                    dietaryRestrictions.includes(restriction) && styles.chipSelected,
                  ]}
                  onPress={() => toggleDietaryRestriction(restriction)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      dietaryRestrictions.includes(restriction) &&
                        styles.chipTextSelected,
                    ]}
                  >
                    {restriction}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Let's personalize your experience</Text>
          <Text style={styles.subtitle}>
            Step {step} of 4
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${(step / 4) * 100}%` }]} />
        </View>

        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={{ flex: 1, marginRight: 8 }}
          />
        )}
        <Button
          title={step === 4 ? 'Complete' : 'Next'}
          onPress={handleNext}
          loading={loading}
          style={{ flex: 1, marginLeft: step > 1 ? 8 : 0 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  stepContainer: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  budgetContainer: {
    gap: 12,
  },
  budgetOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  budgetOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  budgetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  budgetTextSelected: {
    color: '#007AFF',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextSelected: {
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});
