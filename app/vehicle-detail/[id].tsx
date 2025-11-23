
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
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Vehicle } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';
import { useI18n } from '@/contexts/I18nContext';

console.log('🚗 VehicleDetail loaded');

type TabType = 'dashboard' | 'maintenance' | 'fuelLog' | 'tripLog' | 'modifications' | 'documents' | 'reminders';

export default function VehicleDetail() {
  console.log('🚗 VehicleDetail rendering');
  
  const router = useRouter();
  const theme = useTheme();
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

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

  useFocusEffect(
    useCallback(() => {
      console.log('🔍 Loading vehicle with ID:', id);
      loadVehicle();
    }, [id, loadVehicle])
  );

  const handleEdit = () => {
    console.log('✏️ Edit button pressed');
    router.push(`/vehicle-edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      t('deleteVehicleTitle'),
      t('deleteVehicleMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Deleting vehicle:', id);
              await StorageService.deleteVehicle(id);
              console.log('✅ Vehicle deleted');
              Alert.alert(t('success'), t('vehicleDeletedSuccess'), [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/(home)/'),
                },
              ]);
            } catch (error) {
              console.error('❌ Error deleting vehicle:', error);
              Alert.alert(t('error'), 'Failed to delete vehicle');
            }
          },
        },
      ]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <View style={styles.tabContent}>
            <View style={[styles.infoCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {t('year')}
                </Text>
                <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                  {vehicle?.year}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {t('licensePlate')}
                </Text>
                <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                  {vehicle?.licensePlate}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {t('currentMileage')}
                </Text>
                <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                  {vehicle?.currentMileage.toLocaleString()} {t('km')}
                </Text>
              </View>
              {vehicle?.vin && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                      {t('vin')}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                      {vehicle.vin}
                    </Text>
                  </View>
                </>
              )}
              {vehicle && vehicle.purchasePrice > 0 && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                      {t('purchasePrice')}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                      {t('euro')}{vehicle.purchasePrice.toLocaleString()}
                    </Text>
                  </View>
                </>
              )}
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {t('purchaseDate')}
                </Text>
                <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                  {vehicle && new Date(vehicle.purchaseDate).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {vehicle?.notes && (
              <View style={[styles.notesCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
                <Text style={[styles.notesTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
                  {t('notes')}
                </Text>
                <Text style={[styles.notesText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {vehicle.notes}
                </Text>
              </View>
            )}
          </View>
        );
      case 'maintenance':
        return (
          <View style={styles.tabContent}>
            <View style={[styles.emptyStateCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
              <IconSymbol
                ios_icon_name="wrench.fill"
                android_material_icon_name="build"
                size={48}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                No maintenance records yet
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => console.log('Add maintenance')}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.addButtonText}>{t('addMaintenance')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'fuelLog':
        return (
          <View style={styles.tabContent}>
            <View style={[styles.emptyStateCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
              <IconSymbol
                ios_icon_name="fuelpump.fill"
                android_material_icon_name="local_gas_station"
                size={48}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                No fuel logs yet
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => console.log('Add fuel log')}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.addButtonText}>{t('addFuelLog')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'tripLog':
        return (
          <View style={styles.tabContent}>
            <View style={[styles.emptyStateCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
              <IconSymbol
                ios_icon_name="map.fill"
                android_material_icon_name="map"
                size={48}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                No trip logs yet
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => console.log('Add trip log')}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.addButtonText}>{t('addTripLog')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'modifications':
        return (
          <View style={styles.tabContent}>
            <View style={[styles.emptyStateCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
              <IconSymbol
                ios_icon_name="hammer.fill"
                android_material_icon_name="construction"
                size={48}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                No modifications yet
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => console.log('Add modification')}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.addButtonText}>{t('addModification')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'documents':
        return (
          <View style={styles.tabContent}>
            <View style={[styles.emptyStateCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
              <IconSymbol
                ios_icon_name="doc.fill"
                android_material_icon_name="description"
                size={48}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                No documents yet
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => console.log('Add document')}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.addButtonText}>Add Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'reminders':
        return (
          <View style={styles.tabContent}>
            <View style={[styles.emptyStateCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
              <IconSymbol
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={48}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                No reminders yet
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => console.log('Add reminder')}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.addButtonText}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('loadingVehicle')}
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
            {t('vehicleNotFound')}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>{t('back')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const tabs: { key: TabType; label: string; icon: string; androidIcon: string }[] = [
    { key: 'dashboard', label: t('dashboard'), icon: 'gauge', androidIcon: 'dashboard' },
    { key: 'maintenance', label: t('maintenance'), icon: 'wrench.fill', androidIcon: 'build' },
    { key: 'fuelLog', label: t('fuelLog'), icon: 'fuelpump.fill', androidIcon: 'local_gas_station' },
    { key: 'tripLog', label: t('tripLog'), icon: 'map.fill', androidIcon: 'map' },
    { key: 'modifications', label: t('modifications'), icon: 'hammer.fill', androidIcon: 'construction' },
    { key: 'documents', label: t('documents'), icon: 'doc.fill', androidIcon: 'description' },
    { key: 'reminders', label: t('reminders'), icon: 'bell.fill', androidIcon: 'notifications' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <IconSymbol
            ios_icon_name="pencil"
            android_material_icon_name="edit"
            size={24}
            color="#FFFFFF"
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
              {vehicle.type === 'car' ? t('pkw') : t('motorrad')}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScrollView}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  { backgroundColor: theme.dark ? '#1C1C1E' : colors.card },
                  activeTab === tab.key && { backgroundColor: colors.primary },
                ]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  ios_icon_name={tab.icon}
                  android_material_icon_name={tab.androidIcon}
                  size={20}
                  color={activeTab === tab.key ? '#FFFFFF' : (theme.dark ? '#AAA' : colors.textSecondary)}
                />
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.dark ? '#AAA' : colors.textSecondary },
                    activeTab === tab.key && { color: '#FFFFFF', fontWeight: '600' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </ScrollView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>
      </View>
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
    paddingBottom: 40,
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
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
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
    flex: 1,
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  tabsScrollView: {
    marginBottom: 16,
    maxHeight: 50,
  },
  tabsContainer: {
    gap: 8,
    paddingRight: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContent: {
    gap: 16,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
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
  emptyStateCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
