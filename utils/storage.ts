
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle, MaintenanceRecord, FuelLog, TripLog, Modification, VehicleDocument, Reminder } from '@/types/vehicle';

const STORAGE_KEYS = {
  VEHICLES: '@vehicles',
  MAINTENANCE: '@maintenance',
  FUEL_LOGS: '@fuel_logs',
  TRIP_LOGS: '@trip_logs',
  MODIFICATIONS: '@modifications',
  DOCUMENTS: '@documents',
  REMINDERS: '@reminders',
};

export const StorageService = {
  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VEHICLES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting vehicles:', error);
      return [];
    }
  },

  async saveVehicle(vehicle: Vehicle): Promise<void> {
    try {
      const vehicles = await this.getVehicles();
      const index = vehicles.findIndex(v => v.id === vehicle.id);
      if (index >= 0) {
        vehicles[index] = vehicle;
      } else {
        vehicles.push(vehicle);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  },

  async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const vehicles = await this.getVehicles();
      const filtered = vehicles.filter(v => v.id !== vehicleId);
      await AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  },

  // Maintenance Records
  async getMaintenanceRecords(vehicleId?: string): Promise<MaintenanceRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      const records: MaintenanceRecord[] = data ? JSON.parse(data) : [];
      return vehicleId ? records.filter(r => r.vehicleId === vehicleId) : records;
    } catch (error) {
      console.error('Error getting maintenance records:', error);
      return [];
    }
  },

  async saveMaintenanceRecord(record: MaintenanceRecord): Promise<void> {
    try {
      const records = await this.getMaintenanceRecords();
      const index = records.findIndex(r => r.id === record.id);
      if (index >= 0) {
        records[index] = record;
      } else {
        records.push(record);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving maintenance record:', error);
    }
  },

  // Fuel Logs
  async getFuelLogs(vehicleId?: string): Promise<FuelLog[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FUEL_LOGS);
      const logs: FuelLog[] = data ? JSON.parse(data) : [];
      return vehicleId ? logs.filter(l => l.vehicleId === vehicleId) : logs;
    } catch (error) {
      console.error('Error getting fuel logs:', error);
      return [];
    }
  },

  async saveFuelLog(log: FuelLog): Promise<void> {
    try {
      const logs = await this.getFuelLogs();
      const index = logs.findIndex(l => l.id === log.id);
      if (index >= 0) {
        logs[index] = log;
      } else {
        logs.push(log);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving fuel log:', error);
    }
  },

  // Trip Logs
  async getTripLogs(vehicleId?: string): Promise<TripLog[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TRIP_LOGS);
      const logs: TripLog[] = data ? JSON.parse(data) : [];
      return vehicleId ? logs.filter(l => l.vehicleId === vehicleId) : logs;
    } catch (error) {
      console.error('Error getting trip logs:', error);
      return [];
    }
  },

  async saveTripLog(log: TripLog): Promise<void> {
    try {
      const logs = await this.getTripLogs();
      const index = logs.findIndex(l => l.id === log.id);
      if (index >= 0) {
        logs[index] = log;
      } else {
        logs.push(log);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.TRIP_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving trip log:', error);
    }
  },

  // Modifications
  async getModifications(vehicleId?: string): Promise<Modification[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MODIFICATIONS);
      const mods: Modification[] = data ? JSON.parse(data) : [];
      return vehicleId ? mods.filter(m => m.vehicleId === vehicleId) : mods;
    } catch (error) {
      console.error('Error getting modifications:', error);
      return [];
    }
  },

  async saveModification(mod: Modification): Promise<void> {
    try {
      const mods = await this.getModifications();
      const index = mods.findIndex(m => m.id === mod.id);
      if (index >= 0) {
        mods[index] = mod;
      } else {
        mods.push(mod);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.MODIFICATIONS, JSON.stringify(mods));
    } catch (error) {
      console.error('Error saving modification:', error);
    }
  },

  // Reminders
  async getReminders(vehicleId?: string): Promise<Reminder[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
      const reminders: Reminder[] = data ? JSON.parse(data) : [];
      return vehicleId ? reminders.filter(r => r.vehicleId === vehicleId) : reminders;
    } catch (error) {
      console.error('Error getting reminders:', error);
      return [];
    }
  },

  async saveReminder(reminder: Reminder): Promise<void> {
    try {
      const reminders = await this.getReminders();
      const index = reminders.findIndex(r => r.id === reminder.id);
      if (index >= 0) {
        reminders[index] = reminder;
      } else {
        reminders.push(reminder);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  },
};
