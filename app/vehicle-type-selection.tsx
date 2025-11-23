
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function VehicleTypeSelection() {
  const router = useRouter();
  const theme = useTheme();

  const handleSelectType = (type: 'car' | 'motorcycle') => {
    router.push({
      pathname: '/vehicle-registration',
      params: { type },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
          Select Vehicle Type
        </Text>
        <Text style={[styles.subtitle, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
          Choose the type of vehicle you want to add to your garage
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
            onPress={() => handleSelectType('car')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol
                ios_icon_name="car.fill"
                android_material_icon_name="directions_car"
                size={64}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.optionTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
              PKW / Car
            </Text>
            <Text style={[styles.optionDescription, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Add a passenger car to your garage
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
            onPress={() => handleSelectType('motorcycle')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
              <IconSymbol
                ios_icon_name="bicycle"
                android_material_icon_name="motorcycle"
                size={64}
                color={colors.accent}
              />
            </View>
            <Text style={[styles.optionTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
              Motorrad / Motorcycle
            </Text>
            <Text style={[styles.optionDescription, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Add a motorcycle to your garage
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: theme.dark ? colors.primary : colors.primary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 64 : 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
