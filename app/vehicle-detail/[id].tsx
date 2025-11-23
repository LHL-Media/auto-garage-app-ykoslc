
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Vehicle, MaintenanceRecord, FuelLog, Reminder } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';
import MaintenanceForm from '@/components/MaintenanceForm';
import FuelLogForm from '@/components/FuelLogForm';
import ReminderForm from '@/components/ReminderForm';

type TabType = 'dashboard' | 'maintenance' | 'fuel' | 'trips' | 'modifications' | 'documents' | 'reminders';

export default function VehicleDetail() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  useEffect(() => {
    loadVehicle();
  }, [vehicleId]);

  const loadVehicle = async () => {
    try {
      const vehicles = await StorageService.getVehicles();
      const found = vehicles.find(v => v.id === vehicleId);
      setVehicle(found || null);
    } catch (error) {
      console.error('Error loading vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSave = () => {
    setShowMaintenanceForm(false);
    setShowFuelForm(false);
    setShowReminderForm(false);
    loadVehicle();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.dark ? '#FFF' : colors.text }]}>
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.dark ? '#FFF' : colors.text }}>Vehicle not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backToGarageButton}>
            <Text style={{ color: colors.primary }}>Back to Garage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const tabs: { key: TabType; label: string; iosIcon: string; androidIcon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', iosIcon: 'chart.bar.fill', androidIcon: 'dashboard' },
    { key: 'maintenance', label: 'Maintenance', iosIcon: 'wrench.fill', androidIcon: 'build' },
    { key: 'fuel', label: 'Fuel', iosIcon: 'fuelpump.fill', androidIcon: 'local_gas_station' },
    { key: 'trips', label: 'Trips', iosIcon: 'map.fill', androidIcon: 'map' },
    { key: 'modifications', label: 'Mods', iosIcon: 'gearshape.fill', androidIcon: 'settings' },
    { key: 'documents', label: 'Docs', iosIcon: 'doc.fill', androidIcon: 'description' },
    { key: 'reminders', label: 'Reminders', iosIcon: 'bell.fill', androidIcon: 'notifications' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={theme.dark ? '#FFF' : colors.text}
          />
        </TouchableOpacity>
        
        {vehicle.photoUri ? (
          <Image source={{ uri: vehicle.photoUri }} style={styles.headerImage} />
        ) : (
          <View style={[styles.headerImagePlaceholder, { backgroundColor: theme.dark ? '#2C2C2E' : colors.background }]}>
            <IconSymbol
              ios_icon_name={vehicle.type === 'car' ? 'car.fill' : 'bicycle'}
              android_material_icon_name={vehicle.type === 'car' ? 'directions_car' : 'motorcycle'}
              size={40}
              color={theme.dark ? '#666' : colors.textSecondary}
            />
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
            {vehicle.make} {vehicle.model}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            {vehicle.year} • {vehicle.licensePlate}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabBar, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
        contentContainerStyle={styles.tabBarContent}
      >
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <IconSymbol
                ios_icon_name={tab.iosIcon}
                android_material_icon_name={tab.androidIcon}
                size={20}
                color={activeTab === tab.key ? colors.primary : (theme.dark ? '#AAA' : colors.textSecondary)}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === tab.key ? colors.primary : (theme.dark ? '#AAA' : colors.textSecondary) },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'dashboard' && <DashboardTab vehicle={vehicle} theme={theme} />}
        {activeTab === 'maintenance' && (
          <MaintenanceTab 
            vehicleId={vehicleId} 
            theme={theme} 
            onAddPress={() => setShowMaintenanceForm(true)}
          />
        )}
        {activeTab === 'fuel' && (
          <FuelTab 
            vehicleId={vehicleId} 
            theme={theme}
            onAddPress={() => setShowFuelForm(true)}
          />
        )}
        {activeTab === 'trips' && <TripsTab vehicleId={vehicleId} theme={theme} />}
        {activeTab === 'modifications' && <ModificationsTab vehicleId={vehicleId} theme={theme} />}
        {activeTab === 'documents' && <DocumentsTab vehicleId={vehicleId} theme={theme} />}
        {activeTab === 'reminders' && (
          <RemindersTab 
            vehicleId={vehicleId} 
            theme={theme}
            onAddPress={() => setShowReminderForm(true)}
          />
        )}
      </ScrollView>

      <Modal
        visible={showMaintenanceForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMaintenanceForm(false)}
      >
        <View style={{ flex: 1, backgroundColor: theme.dark ? '#000' : colors.background }}>
          <MaintenanceForm
            vehicleId={vehicleId}
            onSave={handleFormSave}
            onCancel={() => setShowMaintenanceForm(false)}
          />
        </View>
      </Modal>

      <Modal
        visible={showFuelForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFuelForm(false)}
      >
        <View style={{ flex: 1, backgroundColor: theme.dark ? '#000' : colors.background }}>
          <FuelLogForm
            vehicleId={vehicleId}
            onSave={handleFormSave}
            onCancel={() => setShowFuelForm(false)}
          />
        </View>
      </Modal>

      <Modal
        visible={showReminderForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReminderForm(false)}
      >
        <View style={{ flex: 1, backgroundColor: theme.dark ? '#000' : colors.background }}>
          <ReminderForm
            vehicleId={vehicleId}
            onSave={handleFormSave}
            onCancel={() => setShowReminderForm(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

function DashboardTab({ vehicle, theme }: { vehicle: Vehicle; theme: any }) {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);

  useEffect(() => {
    loadData();
  }, [vehicle.id]);

  const loadData = async () => {
    const maintenance = await StorageService.getMaintenanceRecords(vehicle.id);
    const fuel = await StorageService.getFuelLogs(vehicle.id);
    setMaintenanceRecords(maintenance);
    setFuelLogs(fuel);
  };

  const totalMaintenanceCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);
  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalSpent = totalMaintenanceCost + totalFuelCost + vehicle.purchasePrice;

  const avgFuelConsumption = fuelLogs.length > 1 
    ? (fuelLogs.reduce((sum, log) => sum + log.amount, 0) / fuelLogs.length).toFixed(2)
    : 'N/A';

  return (
    <View style={styles.tabContent}>
      <View style={[styles.statsCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
        <Text style={[styles.statsTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
          Quick Stats
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Total Spent
            </Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              €{totalSpent.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Maintenance Cost
            </Text>
            <Text style={[styles.statValue, { color: theme.dark ? '#FFF' : colors.text }]}>
              €{totalMaintenanceCost.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Fuel Cost
            </Text>
            <Text style={[styles.statValue, { color: theme.dark ? '#FFF' : colors.text }]}>
              €{totalFuelCost.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Avg. Fuel (L)
            </Text>
            <Text style={[styles.statValue, { color: theme.dark ? '#FFF' : colors.text }]}>
              {avgFuelConsumption}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.statsCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
        <Text style={[styles.statsTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
          Vehicle Information
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Current Mileage
            </Text>
            <Text style={[styles.statValue, { color: theme.dark ? '#FFF' : colors.text }]}>
              {vehicle.currentMileage.toLocaleString()} km
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Purchase Price
            </Text>
            <Text style={[styles.statValue, { color: theme.dark ? '#FFF' : colors.text }]}>
              €{vehicle.purchasePrice.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              VIN
            </Text>
            <Text style={[styles.statValue, { color: theme.dark ? '#FFF' : colors.text }]}>
              {vehicle.vin || 'N/A'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Purchase Date
            </Text>
            <Text style={[styles.statValue, { color: theme.dark ? '#FFF' : colors.text }]}>
              {new Date(vehicle.purchaseDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {vehicle.notes && (
          <View style={styles.notesSection}>
            <Text style={[styles.notesLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              Notes
            </Text>
            <Text style={[styles.notesText, { color: theme.dark ? '#FFF' : colors.text }]}>
              {vehicle.notes}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function MaintenanceTab({ vehicleId, theme, onAddPress }: { vehicleId: string; theme: any; onAddPress: () => void }) {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    loadRecords();
  }, [vehicleId]);

  const loadRecords = async () => {
    const data = await StorageService.getMaintenanceRecords(vehicleId);
    setRecords(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  if (records.length === 0) {
    return (
      <View style={styles.tabContent}>
        <View style={[styles.emptyState, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
          <IconSymbol
            ios_icon_name="wrench.fill"
            android_material_icon_name="build"
            size={48}
            color={theme.dark ? '#666' : colors.textSecondary}
          />
          <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            No maintenance records yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#666' : colors.textSecondary }]}>
            Track service records, oil changes, and repairs
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={onAddPress}
          >
            <IconSymbol
              ios_icon_name="plus"
              android_material_icon_name="add"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.addButtonText}>Add Record</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary, marginBottom: 16 }]}
        onPress={onAddPress}
      >
        <IconSymbol
          ios_icon_name="plus"
          android_material_icon_name="add"
          size={20}
          color="#FFFFFF"
        />
        <Text style={styles.addButtonText}>Add Record</Text>
      </TouchableOpacity>

      {records.map((record, index) => (
        <React.Fragment key={index}>
          <View style={[styles.recordCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
            <View style={styles.recordHeader}>
              <Text style={[styles.recordTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
                {record.type}
              </Text>
              <Text style={[styles.recordCost, { color: colors.primary }]}>
                €{record.cost.toFixed(2)}
              </Text>
            </View>
            <View style={styles.recordDetails}>
              <View style={styles.recordDetailRow}>
                <IconSymbol
                  ios_icon_name="calendar"
                  android_material_icon_name="calendar_today"
                  size={14}
                  color={theme.dark ? '#AAA' : colors.textSecondary}
                />
                <Text style={[styles.recordDetailText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {new Date(record.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.recordDetailRow}>
                <IconSymbol
                  ios_icon_name="gauge"
                  android_material_icon_name="speed"
                  size={14}
                  color={theme.dark ? '#AAA' : colors.textSecondary}
                />
                <Text style={[styles.recordDetailText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {record.mileage.toLocaleString()} km
                </Text>
              </View>
            </View>
            {record.serviceProvider && (
              <Text style={[styles.recordProvider, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                {record.serviceProvider}
              </Text>
            )}
            {record.notes && (
              <Text style={[styles.recordNotes, { color: theme.dark ? '#CCC' : colors.text }]}>
                {record.notes}
              </Text>
            )}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

function FuelTab({ vehicleId, theme, onAddPress }: { vehicleId: string; theme: any; onAddPress: () => void }) {
  const [logs, setLogs] = useState<FuelLog[]>([]);

  useEffect(() => {
    loadLogs();
  }, [vehicleId]);

  const loadLogs = async () => {
    const data = await StorageService.getFuelLogs(vehicleId);
    setLogs(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  if (logs.length === 0) {
    return (
      <View style={styles.tabContent}>
        <View style={[styles.emptyState, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
          <IconSymbol
            ios_icon_name="fuelpump.fill"
            android_material_icon_name="local_gas_station"
            size={48}
            color={theme.dark ? '#666' : colors.textSecondary}
          />
          <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            No fuel logs yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#666' : colors.textSecondary }]}>
            Track refueling and calculate fuel consumption
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={onAddPress}
          >
            <IconSymbol
              ios_icon_name="plus"
              android_material_icon_name="add"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.addButtonText}>Add Fuel Log</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary, marginBottom: 16 }]}
        onPress={onAddPress}
      >
        <IconSymbol
          ios_icon_name="plus"
          android_material_icon_name="add"
          size={20}
          color="#FFFFFF"
        />
        <Text style={styles.addButtonText}>Add Fuel Log</Text>
      </TouchableOpacity>

      {logs.map((log, index) => (
        <React.Fragment key={index}>
          <View style={[styles.recordCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
            <View style={styles.recordHeader}>
              <Text style={[styles.recordTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
                {log.fuelType}
              </Text>
              <Text style={[styles.recordCost, { color: colors.primary }]}>
                €{log.cost.toFixed(2)}
              </Text>
            </View>
            <View style={styles.recordDetails}>
              <View style={styles.recordDetailRow}>
                <IconSymbol
                  ios_icon_name="calendar"
                  android_material_icon_name="calendar_today"
                  size={14}
                  color={theme.dark ? '#AAA' : colors.textSecondary}
                />
                <Text style={[styles.recordDetailText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {new Date(log.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.recordDetailRow}>
                <IconSymbol
                  ios_icon_name="gauge"
                  android_material_icon_name="speed"
                  size={14}
                  color={theme.dark ? '#AAA' : colors.textSecondary}
                />
                <Text style={[styles.recordDetailText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {log.mileage.toLocaleString()} km
                </Text>
              </View>
              <View style={styles.recordDetailRow}>
                <IconSymbol
                  ios_icon_name="drop.fill"
                  android_material_icon_name="water_drop"
                  size={14}
                  color={theme.dark ? '#AAA' : colors.textSecondary}
                />
                <Text style={[styles.recordDetailText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  {log.amount.toFixed(2)} L
                </Text>
              </View>
            </View>
            {log.station && (
              <Text style={[styles.recordProvider, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                {log.station}
              </Text>
            )}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

function TripsTab({ vehicleId, theme }: { vehicleId: string; theme: any }) {
  return (
    <View style={styles.tabContent}>
      <View style={[styles.emptyState, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
        <IconSymbol
          ios_icon_name="map.fill"
          android_material_icon_name="map"
          size={48}
          color={theme.dark ? '#666' : colors.textSecondary}
        />
        <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
          No trip logs yet
        </Text>
        <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#666' : colors.textSecondary }]}>
          Record trips for business or personal purposes
        </Text>
      </View>
    </View>
  );
}

function ModificationsTab({ vehicleId, theme }: { vehicleId: string; theme: any }) {
  return (
    <View style={styles.tabContent}>
      <View style={[styles.emptyState, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
        <IconSymbol
          ios_icon_name="gearshape.fill"
          android_material_icon_name="settings"
          size={48}
          color={theme.dark ? '#666' : colors.textSecondary}
        />
        <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
          No modifications yet
        </Text>
        <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#666' : colors.textSecondary }]}>
          Document upgrades and changes to your vehicle
        </Text>
      </View>
    </View>
  );
}

function DocumentsTab({ vehicleId, theme }: { vehicleId: string; theme: any }) {
  return (
    <View style={styles.tabContent}>
      <View style={[styles.emptyState, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
        <IconSymbol
          ios_icon_name="doc.fill"
          android_material_icon_name="description"
          size={48}
          color={theme.dark ? '#666' : colors.textSecondary}
        />
        <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
          No documents yet
        </Text>
        <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#666' : colors.textSecondary }]}>
          Store insurance, registration, and inspection records
        </Text>
      </View>
    </View>
  );
}

function RemindersTab({ vehicleId, theme, onAddPress }: { vehicleId: string; theme: any; onAddPress: () => void }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    loadReminders();
  }, [vehicleId]);

  const loadReminders = async () => {
    const data = await StorageService.getReminders(vehicleId);
    setReminders(data.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
  };

  const toggleReminder = async (reminder: Reminder) => {
    const updated = { ...reminder, completed: !reminder.completed };
    await StorageService.saveReminder(updated);
    loadReminders();
  };

  if (reminders.length === 0) {
    return (
      <View style={styles.tabContent}>
        <View style={[styles.emptyState, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
          <IconSymbol
            ios_icon_name="bell.fill"
            android_material_icon_name="notifications"
            size={48}
            color={theme.dark ? '#666' : colors.textSecondary}
          />
          <Text style={[styles.emptyStateText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            No reminders set
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#666' : colors.textSecondary }]}>
            Set alerts for upcoming inspections and maintenance
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={onAddPress}
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
  }

  return (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary, marginBottom: 16 }]}
        onPress={onAddPress}
      >
        <IconSymbol
          ios_icon_name="plus"
          android_material_icon_name="add"
          size={20}
          color="#FFFFFF"
        />
        <Text style={styles.addButtonText}>Add Reminder</Text>
      </TouchableOpacity>

      {reminders.map((reminder, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={[styles.recordCard, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              opacity: reminder.completed ? 0.6 : 1,
            }]}
            onPress={() => toggleReminder(reminder)}
          >
            <View style={styles.recordHeader}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={[
                  styles.checkbox,
                  { 
                    borderColor: theme.dark ? '#3A3A3C' : colors.border,
                    backgroundColor: reminder.completed ? colors.primary : 'transparent',
                  }
                ]}>
                  {reminder.completed && (
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={16}
                      color="#FFFFFF"
                    />
                  )}
                </View>
                <Text style={[
                  styles.recordTitle, 
                  { 
                    color: theme.dark ? '#FFF' : colors.text,
                    textDecorationLine: reminder.completed ? 'line-through' : 'none',
                  }
                ]}>
                  {reminder.title}
                </Text>
              </View>
            </View>
            <Text style={[styles.recordNotes, { color: theme.dark ? '#CCC' : colors.text }]}>
              {reminder.description}
            </Text>
            <View style={styles.recordDetails}>
              <View style={styles.recordDetailRow}>
                <IconSymbol
                  ios_icon_name="calendar"
                  android_material_icon_name="calendar_today"
                  size={14}
                  color={theme.dark ? '#AAA' : colors.textSecondary}
                />
                <Text style={[styles.recordDetailText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                  Due: {new Date(reminder.dueDate).toLocaleDateString()}
                </Text>
              </View>
              {reminder.dueMileage && (
                <View style={styles.recordDetailRow}>
                  <IconSymbol
                    ios_icon_name="gauge"
                    android_material_icon_name="speed"
                    size={14}
                    color={theme.dark ? '#AAA' : colors.textSecondary}
                  />
                  <Text style={[styles.recordDetailText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                    {reminder.dueMileage.toLocaleString()} km
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  backToGarageButton: {
    marginTop: 16,
    padding: 12,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  headerImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  tabBar: {
    maxHeight: 60,
  },
  tabBarContent: {
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  tabContent: {
    gap: 16,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    gap: 16,
  },
  statItem: {
    gap: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  notesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recordCard: {
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  recordCost: {
    fontSize: 18,
    fontWeight: '700',
  },
  recordDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  recordDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordDetailText: {
    fontSize: 14,
  },
  recordProvider: {
    fontSize: 14,
    marginTop: 4,
  },
  recordNotes: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
