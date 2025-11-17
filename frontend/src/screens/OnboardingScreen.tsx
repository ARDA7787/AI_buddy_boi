/**
 * Onboarding screen with preference wizard
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { api } from '../services/api';

const INTERESTS = [
  'Culture', 'Food', 'Nightlife', 'Adventure', 'Nature',
  'Shopping', 'History', 'Art', 'Beach', 'Photography'
];

const DIETARY_RESTRICTIONS = [
  'None', 'Vegetarian', 'Vegan', 'Halal', 'Kosher',
  'Gluten-Free', 'Dairy-Free', 'Nut Allergy'
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [budgetPerDay, setBudgetPerDay] = useState(100);
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState<'chilled' | 'balanced' | 'packed'>('balanced');
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(['None']);
  const [loading, setLoading] = useState(false);

  const { setUser } = useStore();

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const toggleDietary = (restriction: string) => {
    if (restriction === 'None') {
      setDietaryRestrictions(['None']);
    } else {
      const filtered = dietaryRestrictions.filter(r => r !== 'None');
      if (filtered.includes(restriction)) {
        const updated = filtered.filter(r => r !== restriction);
        setDietaryRestrictions(updated.length === 0 ? ['None'] : updated);
      } else {
        setDietaryRestrictions([...filtered, restriction]);
      }
    }
  };

  const handleFinish = async () => {
    if (interests.length === 0) {
      Alert.alert('Oops', 'Please select at least one interest');
      return;
    }

    setLoading(true);
    try {
      const user = await api.updatePreferences({
        budget_per_day: budgetPerDay,
        interests: interests.map(i => i.toLowerCase()),
        travel_style: travelStyle,
        risk_tolerance: riskTolerance,
        dietary_restrictions: dietaryRestrictions.includes('None') ? [] : dietaryRestrictions,
      });
      setUser(user);
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const renderBudgetStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your daily budget?</Text>
      <Text style={styles.stepSubtitle}>This helps us find activities that match your spending comfort</Text>

      <View style={styles.budgetContainer}>
        <Text style={styles.budgetValue}>${budgetPerDay}/day</Text>
        <View style={styles.budgetButtons}>
          {[50, 100, 150, 200, 300].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[styles.budgetButton, budgetPerDay === amount && styles.budgetButtonActive]}
              onPress={() => setBudgetPerDay(amount)}
            >
              <Text style={[styles.budgetButtonText, budgetPerDay === amount && styles.budgetButtonTextActive]}>
                ${amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderInterestsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What interests you?</Text>
      <Text style={styles.stepSubtitle}>Select all that apply</Text>

      <View style={styles.chipsContainer}>
        {INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[styles.chip, interests.includes(interest) && styles.chipActive]}
            onPress={() => toggleInterest(interest)}
          >
            <Text style={[styles.chipText, interests.includes(interest) && styles.chipTextActive]}>
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTravelStyleStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>How do you like to travel?</Text>

      <TouchableOpacity
        style={[styles.optionCard, travelStyle === 'chilled' && styles.optionCardActive]}
        onPress={() => setTravelStyle('chilled')}
      >
        <Ionicons name="cafe" size={32} color={travelStyle === 'chilled' ? '#007AFF' : '#666'} />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Chilled</Text>
          <Text style={styles.optionDescription}>Slow mornings, flexible schedule, plenty of rest</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionCard, travelStyle === 'balanced' && styles.optionCardActive]}
        onPress={() => setTravelStyle('balanced')}
      >
        <Ionicons name="sunny" size={32} color={travelStyle === 'balanced' ? '#007AFF' : '#666'} />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Balanced</Text>
          <Text style={styles.optionDescription}>Mix of activities and downtime</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionCard, travelStyle === 'packed' && styles.optionCardActive]}
        onPress={() => setTravelStyle('packed')}
      >
        <Ionicons name="flash" size={32} color={travelStyle === 'packed' ? '#007AFF' : '#666'} />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Packed</Text>
          <Text style={styles.optionDescription}>See everything, maximize experiences</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderDietaryStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Any dietary preferences?</Text>
      <Text style={styles.stepSubtitle}>We'll recommend restaurants accordingly</Text>

      <View style={styles.chipsContainer}>
        {DIETARY_RESTRICTIONS.map((restriction) => (
          <TouchableOpacity
            key={restriction}
            style={[styles.chip, dietaryRestrictions.includes(restriction) && styles.chipActive]}
            onPress={() => toggleDietary(restriction)}
          >
            <Text style={[styles.chipText, dietaryRestrictions.includes(restriction) && styles.chipTextActive]}>
              {restriction}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSafetyStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Safety comfort level?</Text>
      <Text style={styles.stepSubtitle}>How much adventure are you comfortable with?</Text>

      <TouchableOpacity
        style={[styles.optionCard, riskTolerance === 'low' && styles.optionCardActive]}
        onPress={() => setRiskTolerance('low')}
      >
        <Ionicons name="shield-checkmark" size={32} color={riskTolerance === 'low' ? '#007AFF' : '#666'} />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Cautious</Text>
          <Text style={styles.optionDescription}>Stick to well-known, safe areas</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionCard, riskTolerance === 'medium' && styles.optionCardActive]}
        onPress={() => setRiskTolerance('medium')}
      >
        <Ionicons name="compass" size={32} color={riskTolerance === 'medium' ? '#007AFF' : '#666'} />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Balanced</Text>
          <Text style={styles.optionDescription}>Mix of popular and local spots</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionCard, riskTolerance === 'high' && styles.optionCardActive]}
        onPress={() => setRiskTolerance('high')}
      >
        <Ionicons name="trail-sign" size={32} color={riskTolerance === 'high' ? '#007AFF' : '#666'} />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Adventurous</Text>
          <Text style={styles.optionDescription}>Explore off the beaten path</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const steps = [
    renderBudgetStep,
    renderInterestsStep,
    renderTravelStyleStep,
    renderDietaryStep,
    renderSafetyStep,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Let's personalize your experience</Text>
        <Text style={styles.headerStep}>Step {step + 1} of {steps.length}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((step + 1) / steps.length) * 100}%` }]} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {steps[step]()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={() => {
            if (step < steps.length - 1) {
              setStep(step + 1);
            } else {
              handleFinish();
            }
          }}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>
            {step < steps.length - 1 ? 'Next' : loading ? 'Finishing...' : 'Finish'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerStep: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  budgetContainer: {
    alignItems: 'center',
  },
  budgetValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 24,
  },
  budgetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  budgetButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  budgetButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  budgetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  budgetButtonTextActive: {
    color: '#fff',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  optionCardActive: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  optionContent: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  backButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
