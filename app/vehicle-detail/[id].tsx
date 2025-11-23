
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Vehicle } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';

console.log('🚗 VehicleDetail loaded');

export default function VehicleDetail() {
  console.log('🚗 VehicleDetail rendering');
  
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  const loadVehicle = useCallback(async () => {
    try {
      const vehicles = await StorageService.getVehicles();
      const found = vehicles.find(v => v.id === id);
      console.log('✅ Vehicle found:', found);
      setVehicle(found || null);
    } catch (error) {
      console.error('❌ Error loading vehicle:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    console.log('🔍 Loading vehicle with ID:', id);
    loadVehicle();
  }, [id, loadVehicle]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Deleting vehicle:', id);
              await StorageService.deleteVehicle(id);
              console.log('✅ Vehicle deleted');
              router.replace('/(tabs)/(home)/');
            } catch (error) {
              console.error('❌ Error deleting vehicle:', error);
              Alert.alert('Error', 'Failed to delete vehicle');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.dark ? '#FFF' : colors.text }]}>
            Loading vehicle...
          </Text>
        </View>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.dark ? '#FFF' : colors.text }]}>
            Vehicle not found
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={theme.dark ? '#FFF' : colors.text}
            />
          </TouchableOpacity>
        </View>

        {vehicle.photoUri ? (
          <Image source={{ uri: vehicle.photoUri }} style={styles.vehicleImage} />
        ) : (
          <View style={[styles.vehicleImagePlaceholder, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
            <IconSymbol
              ios_icon_name={vehicle.type === 'car' ? 'car.fill' : 'bicycle'}
              android_material_icon_name={vehicle.type === 'car' ? 'directions_car' : 'motorcycle'}
              size={80}
              color={theme.dark ? '#666' : colors.textSecondary}
            />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
              {vehicle.make} {vehicle.model}
            </Text>
            <View style={styles.typeTag}>
              <IconSymbol
                ios_icon_name={vehicle.type === 'car' ? 'car.fill' : 'bicycle'}
                android_material_icon_name={vehicle.type === 'car' ? 'directions_car' : 'motorcycle'}
                size={16}
                color={vehicle.type === 'car' ? colors.primary : colors.accent}
              />
              <Text style={[styles.typeText, { color: vehicle.type === 'car' ? colors.primary : colors.accent }]}>
                {vehicle.type === 'car' ? 'PKW' : 'Motorrad'}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                Year
              </Text>
              <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                {vehicle.year}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                License Plate
              </Text>
              <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                {vehicle.licensePlate}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                Current Mileage
              </Text>
              <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                {vehicle.currentMileage.toLocaleString()} km
              </Text>
            </View>
            {vehicle.vin && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                    VIN
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                    {vehicle.vin}
                  </Text>
                </View>
              </>
            )}
            {vehicle.purchasePrice > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                    Purchase Price
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                    €{vehicle.purchasePrice.toLocaleString()}
                  </Text>
                </View>
              </>
            )}
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                Purchase Date
              </Text>
              <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                {new Date(vehicle.purchaseDate).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {vehicle.notes && (
            <View style={[styles.notesCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
              <Text style={[styles.notesTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
                Notes
              </Text>
              <Text style={[styles.notesText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                {vehicle.notes}
              </Text>
            </View>
          )}

          <View style={styles.actionsSection}>
            <Text style={[styles.sectionTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
              Quick Actions
            </Text>
            
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="wrench.fill"
                android_material_icon_name="build"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.actionText, { color: theme.dark ? '#FFF' : colors.text }]}>
                Maintenance
              </Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={20}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="fuelpump.fill"
                android_material_icon_name="local_gas_station"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.actionText, { color: theme.dark ? '#FFF' : colors.text }]}>
                Fuel Log
              </Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={20}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="map.fill"
                android_material_icon_name="map"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.actionText, { color: theme.dark ? '#FFF' : colors.text }]}>
                Trip Log
              </Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={20}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={handleDelete}
          >
            <IconSymbol
              ios_icon_name="trash.fill"
              android_material_icon_name="delete"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.deleteButtonText}>Delete Vehicle</Text>
          </TouchableOpacity>
        </View>
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
  emptyText: {
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 60,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  vehicleImagePlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    flex: 1,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 4,
  },
  notesCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
