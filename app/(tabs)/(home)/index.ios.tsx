
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Vehicle } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';
import { useI18n } from '@/contexts/I18nContext';

console.log('🏠 GarageScreen (iOS) loaded');

export default function GarageScreen() {
  console.log('🏠 GarageScreen (iOS) rendering');
  
  const router = useRouter();
  const theme = useTheme();
  const { t } = useI18n();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 GarageScreen (iOS) focused, loading vehicles');
      loadVehicles();
    }, [])
  );

  const loadVehicles = async () => {
    try {
      console.log('📦 Loading vehicles from storage (iOS)');
      const data = await StorageService.getVehicles();
      console.log('✅ Vehicles loaded (iOS):', data.length);
      setVehicles(data);
    } catch (error) {
      console.error('❌ Error loading vehicles (iOS):', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = () => {
    console.log('➕ Add vehicle button pressed (iOS)');
    router.push('/vehicle-registration');
  };

  const handleVehiclePress = (vehicleId: string) => {
    console.log('🚗 Vehicle pressed (iOS):', vehicleId);
    router.push(`/vehicle-detail/${vehicleId}`);
  };

  if (loading) {
    console.log('⏳ Loading state (iOS)');
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('loadingGarage')}
          </Text>
        </View>
      </View>
    );
  }

  if (vehicles.length === 0) {
    console.log('📭 Empty garage state (iOS)');
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
        <View style={styles.emptyContainer}>
          <IconSymbol
            ios_icon_name="car.fill"
            android_material_icon_name="directions_car"
            size={80}
            color={theme.dark ? '#666' : colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('emptyGarageTitle')}
          </Text>
          <Text style={[styles.emptyText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            {t('emptyGarageText')}
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddVehicle}
          >
            <IconSymbol
              ios_icon_name="plus"
              android_material_icon_name="add"
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.addButtonText}>{t('addVehicle')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  console.log('🚗 Rendering garage with vehicles (iOS):', vehicles.length);
  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('myGarage')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            {vehicles.length} {vehicles.length === 1 ? t('vehicle') : t('vehicles')}
          </Text>
        </View>

        <View style={styles.vehiclesGrid}>
          {vehicles.map((vehicle, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[styles.vehicleCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
                onPress={() => handleVehiclePress(vehicle.id)}
                activeOpacity={0.7}
              >
                {vehicle.photoUri ? (
                  <Image source={{ uri: vehicle.photoUri }} style={styles.vehicleImage} />
                ) : (
                  <View style={[styles.vehicleImagePlaceholder, { backgroundColor: theme.dark ? '#2C2C2E' : colors.background }]}>
                    <IconSymbol
                      ios_icon_name={vehicle.type === 'car' ? 'car.fill' : 'bicycle'}
                      android_material_icon_name={vehicle.type === 'car' ? 'directions_car' : 'motorcycle'}
                      size={48}
                      color={theme.dark ? '#666' : colors.textSecondary}
                    />
                  </View>
                )}
                <View style={styles.vehicleInfo}>
                  <Text style={[styles.vehicleMake, { color: theme.dark ? '#FFF' : colors.text }]}>
                    {vehicle.make} {vehicle.model}
                  </Text>
                  <Text style={[styles.vehicleYear, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                    {vehicle.year}
                  </Text>
                  <View style={styles.vehicleDetails}>
                    <View style={styles.detailRow}>
                      <IconSymbol
                        ios_icon_name="number"
                        android_material_icon_name="confirmation_number"
                        size={14}
                        color={theme.dark ? '#AAA' : colors.textSecondary}
                      />
                      <Text style={[styles.detailText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                        {vehicle.licensePlate}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <IconSymbol
                        ios_icon_name="gauge"
                        android_material_icon_name="speed"
                        size={14}
                        color={theme.dark ? '#AAA' : colors.textSecondary}
                      />
                      <Text style={[styles.detailText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                        {vehicle.currentMileage.toLocaleString()} {t('km')}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: colors.primary }]}
          onPress={handleAddVehicle}
        >
          <IconSymbol
            ios_icon_name="plus"
            android_material_icon_name="add"
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  vehiclesGrid: {
    gap: 16,
  },
  vehicleCard: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  vehicleImagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleMake: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  vehicleYear: {
    fontSize: 14,
    marginBottom: 12,
  },
  vehicleDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
  },
  fabButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 6,
  },
});
