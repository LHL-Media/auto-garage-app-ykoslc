
export type VehicleType = 'car' | 'motorcycle';

export interface Vehicle {
  id: string;
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
  type: string;
  cost: number;
  serviceProvider: string;
  notes?: string;
  createdAt: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  amount: number;
  cost: number;
  fuelType: string;
  station?: string;
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
}

export interface Reminder {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
  dueDate: string;
  dueMileage?: number;
  completed: boolean;
  createdAt: string;
}
