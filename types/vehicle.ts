
export type VehicleType = 'car' | 'motorcycle';

export type FuelType = 'benzin' | 'diesel' | 'super' | 'e10' | 'electric' | 'hybrid' | 'lpg';

export type MaintenanceCategory = 
  | 'oil_change'
  | 'tire_rotation'
  | 'brake_service'
  | 'inspection'
  | 'battery'
  | 'air_filter'
  | 'cabin_filter'
  | 'spark_plugs'
  | 'coolant'
  | 'transmission'
  | 'other';

export type ReminderType = 'mileage' | 'time' | 'both';

export type RecallStatus = 'open' | 'resolved';

export interface Vehicle {
  id: string;
  user_id?: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  purchaseDate: string;
  purchasePrice: number;
  currentMileage: number;
  photoUri?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  category: MaintenanceCategory;
  serviceProviderName?: string;
  serviceProviderPhone?: string;
  serviceProviderAddress?: string;
  laborCost: number;
  partsCost: number;
  taxCost: number;
  totalCost: number;
  notes?: string;
  partsReplaced?: string[];
  warrantyExpiry?: string;
  createdAt: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  amount: number;
  cost: number;
  fuelType: FuelType;
  partialFill: boolean;
  station?: string;
  pricePerUnit?: number;
  efficiency?: number;
  createdAt: string;
}

export interface TripLog {
  id: string;
  vehicleId: string;
  date: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  purpose: 'business' | 'personal';
  notes?: string;
  createdAt: string;
}

export interface Modification {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  cost: number;
  photoUri?: string;
  notes?: string;
  createdAt: string;
}

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  type: string;
  name: string;
  fileUri: string;
  uploadDate: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
  dueDate?: string;
  dueMileage?: number;
  reminderType?: ReminderType;
  recurring: boolean;
  recurringIntervalMonths?: number;
  recurringIntervalKm?: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface InsurancePolicy {
  id: string;
  vehicleId: string;
  provider: string;
  policyNumber: string;
  startDate: string;
  expiryDate: string;
  premium?: number;
  coverageType?: string;
  notes?: string;
  createdAt: string;
}

export interface Recall {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
  recallDate: string;
  status: RecallStatus;
  resolvedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface FuelEfficiencyData {
  date: string;
  efficiency: number;
  cost: number;
}

export interface MaintenanceCostData {
  category: MaintenanceCategory;
  totalCost: number;
  count: number;
}

export interface MonthlyExpenseData {
  month: string;
  fuel: number;
  maintenance: number;
  insurance: number;
  total: number;
}

export interface TotalCostOfOwnership {
  purchasePrice: number;
  depreciation: number;
  totalFuel: number;
  totalMaintenance: number;
  totalInsurance: number;
  totalModifications: number;
  total: number;
}
