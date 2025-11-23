
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@app_language';

export const translations = {
  en: {
    // Navigation
    garage: 'Garage',
    home: 'Home',
    addVehicle: 'Add Vehicle',
    analytics: 'Analytics',
    settings: 'Settings',
    profile: 'Profile',
    
    // Vehicle Types
    car: 'Car',
    motorcycle: 'Motorcycle',
    pkw: 'PKW (Car)',
    motorrad: 'Motorcycle',
    
    // Tabs
    dashboard: 'Dashboard',
    maintenance: 'Maintenance',
    fuelLog: 'Fuel Log',
    tripLog: 'Trip Log',
    modifications: 'Modifications',
    documents: 'Documents',
    reminders: 'Reminders',
    
    // Actions
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    discardChanges: 'Discard Changes',
    add: 'Add',
    back: 'Back',
    
    // Vehicle Form
    vehicleType: 'Vehicle Type',
    make: 'Make',
    model: 'Model',
    year: 'Year',
    vin: 'VIN',
    licensePlate: 'License Plate',
    purchaseDate: 'Purchase Date',
    purchasePrice: 'Purchase Price',
    currentMileage: 'Current Mileage',
    mileage: 'Mileage',
    photo: 'Photo',
    notes: 'Notes',
    required: 'Required',
    optional: 'Optional',
    
    // Messages
    loading: 'Loading...',
    saving: 'Saving...',
    loadingVehicle: 'Loading vehicle...',
    loadingGarage: 'Loading your garage...',
    emptyGarageTitle: 'Your Garage is Empty',
    emptyGarageText: 'Add your first vehicle to start tracking maintenance, fuel, and more.',
    vehicleNotFound: 'Vehicle not found',
    success: 'Success',
    error: 'Error',
    
    // Alerts
    deleteVehicleTitle: 'Delete Vehicle',
    deleteVehicleMessage: 'Are you sure you want to delete this vehicle? This action cannot be undone.',
    deleteConfirmTitle: 'Are you sure?',
    deleteConfirmMessage: 'This cannot be undone.',
    discardChangesTitle: 'Discard Changes?',
    discardChangesMessage: 'You have unsaved changes. Are you sure you want to discard them?',
    vehicleAddedSuccess: 'Vehicle added successfully!',
    vehicleUpdatedSuccess: 'Vehicle updated successfully!',
    vehicleDeletedSuccess: 'Vehicle deleted successfully!',
    
    // Validation
    missingInformation: 'Missing Information',
    fillRequiredFields: 'Please fill in all required fields (Make, Model, Year, License Plate, Mileage).',
    invalidYear: 'Invalid Year',
    invalidYearMessage: 'Please enter a valid year between 1900 and',
    invalidMileage: 'Invalid Mileage',
    invalidMileageMessage: 'Please enter a valid mileage (0 or greater).',
    invalidVIN: 'Invalid VIN',
    invalidVINMessage: 'VIN must be exactly 17 characters.',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    refuel: 'Refuel',
    
    // Stats
    vehicles: 'Vehicles',
    vehicle: 'Vehicle',
    myGarage: 'My Garage',
    
    // Photo
    addPhoto: 'Add Photo',
    addPhotoOptional: 'Add Photo (Optional)',
    choosePhotoSource: 'Choose a photo source',
    camera: 'Camera',
    gallery: 'Gallery',
    permissionRequired: 'Permission Required',
    cameraPermissionMessage: 'Camera permission is required to take photos.',
    
    // Language
    language: 'Language',
    german: 'Deutsch',
    english: 'English',
    
    // Maintenance
    maintenanceDate: 'Date',
    maintenanceCost: 'Cost',
    serviceType: 'Service Type',
    serviceProvider: 'Service Provider',
    addMaintenance: 'Add Maintenance',
    editMaintenance: 'Edit Maintenance',
    
    // Fuel Log
    fuelAmount: 'Amount',
    fuelCost: 'Cost',
    fuelType: 'Fuel Type',
    station: 'Station',
    addFuelLog: 'Add Fuel Log',
    editFuelLog: 'Edit Fuel Log',
    
    // Trip Log
    startLocation: 'Start Location',
    endLocation: 'End Location',
    distance: 'Distance',
    purpose: 'Purpose',
    business: 'Business',
    personal: 'Personal',
    addTripLog: 'Add Trip Log',
    editTripLog: 'Edit Trip Log',
    
    // Modifications
    description: 'Description',
    cost: 'Cost',
    date: 'Date',
    addModification: 'Add Modification',
    editModification: 'Edit Modification',
    
    // Units
    km: 'km',
    liters: 'liters',
    euro: '€',
  },
  de: {
    // Navigation
    garage: 'Garage',
    home: 'Startseite',
    addVehicle: 'Fahrzeug hinzufügen',
    analytics: 'Statistiken',
    settings: 'Einstellungen',
    profile: 'Profil',
    
    // Vehicle Types
    car: 'Auto',
    motorcycle: 'Motorrad',
    pkw: 'PKW (Auto)',
    motorrad: 'Motorrad',
    
    // Tabs
    dashboard: 'Übersicht',
    maintenance: 'Wartung',
    fuelLog: 'Tanken',
    tripLog: 'Fahrtenbuch',
    modifications: 'Änderungen',
    documents: 'Dokumente',
    reminders: 'Erinnerungen',
    
    // Actions
    edit: 'Bearbeiten',
    delete: 'Löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    saveChanges: 'Änderungen speichern',
    discardChanges: 'Änderungen verwerfen',
    add: 'Hinzufügen',
    back: 'Zurück',
    
    // Vehicle Form
    vehicleType: 'Fahrzeugtyp',
    make: 'Marke',
    model: 'Modell',
    year: 'Jahr',
    vin: 'FIN',
    licensePlate: 'Kennzeichen',
    purchaseDate: 'Kaufdatum',
    purchasePrice: 'Kaufpreis',
    currentMileage: 'Kilometerstand',
    mileage: 'Kilometerstand',
    photo: 'Foto',
    notes: 'Notizen',
    required: 'Erforderlich',
    optional: 'Optional',
    
    // Messages
    loading: 'Lädt...',
    saving: 'Speichert...',
    loadingVehicle: 'Fahrzeug wird geladen...',
    loadingGarage: 'Garage wird geladen...',
    emptyGarageTitle: 'Ihre Garage ist leer',
    emptyGarageText: 'Fügen Sie Ihr erstes Fahrzeug hinzu, um Wartung, Tanken und mehr zu verfolgen.',
    vehicleNotFound: 'Fahrzeug nicht gefunden',
    success: 'Erfolg',
    error: 'Fehler',
    
    // Alerts
    deleteVehicleTitle: 'Fahrzeug löschen',
    deleteVehicleMessage: 'Sind Sie sicher, dass Sie dieses Fahrzeug löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    deleteConfirmTitle: 'Sind Sie sicher?',
    deleteConfirmMessage: 'Dies kann nicht rückgängig gemacht werden.',
    discardChangesTitle: 'Änderungen verwerfen?',
    discardChangesMessage: 'Sie haben ungespeicherte Änderungen. Möchten Sie diese wirklich verwerfen?',
    vehicleAddedSuccess: 'Fahrzeug erfolgreich hinzugefügt!',
    vehicleUpdatedSuccess: 'Fahrzeug erfolgreich aktualisiert!',
    vehicleDeletedSuccess: 'Fahrzeug erfolgreich gelöscht!',
    
    // Validation
    missingInformation: 'Fehlende Informationen',
    fillRequiredFields: 'Bitte füllen Sie alle erforderlichen Felder aus (Marke, Modell, Jahr, Kennzeichen, Kilometerstand).',
    invalidYear: 'Ungültiges Jahr',
    invalidYearMessage: 'Bitte geben Sie ein gültiges Jahr zwischen 1900 und',
    invalidMileage: 'Ungültiger Kilometerstand',
    invalidMileageMessage: 'Bitte geben Sie einen gültigen Kilometerstand ein (0 oder größer).',
    invalidVIN: 'Ungültige FIN',
    invalidVINMessage: 'FIN muss genau 17 Zeichen lang sein.',
    
    // Quick Actions
    quickActions: 'Schnellaktionen',
    refuel: 'Tanken',
    
    // Stats
    vehicles: 'Fahrzeuge',
    vehicle: 'Fahrzeug',
    myGarage: 'Meine Garage',
    
    // Photo
    addPhoto: 'Foto hinzufügen',
    addPhotoOptional: 'Foto hinzufügen (Optional)',
    choosePhotoSource: 'Wählen Sie eine Fotoquelle',
    camera: 'Kamera',
    gallery: 'Galerie',
    permissionRequired: 'Berechtigung erforderlich',
    cameraPermissionMessage: 'Kameraberechtigung ist erforderlich, um Fotos aufzunehmen.',
    
    // Language
    language: 'Sprache',
    german: 'Deutsch',
    english: 'English',
    
    // Maintenance
    maintenanceDate: 'Datum',
    maintenanceCost: 'Kosten',
    serviceType: 'Servicetyp',
    serviceProvider: 'Serviceanbieter',
    addMaintenance: 'Wartung hinzufügen',
    editMaintenance: 'Wartung bearbeiten',
    
    // Fuel Log
    fuelAmount: 'Menge',
    fuelCost: 'Kosten',
    fuelType: 'Kraftstoffart',
    station: 'Tankstelle',
    addFuelLog: 'Tankvorgang hinzufügen',
    editFuelLog: 'Tankvorgang bearbeiten',
    
    // Trip Log
    startLocation: 'Startort',
    endLocation: 'Zielort',
    distance: 'Entfernung',
    purpose: 'Zweck',
    business: 'Geschäftlich',
    personal: 'Privat',
    addTripLog: 'Fahrt hinzufügen',
    editTripLog: 'Fahrt bearbeiten',
    
    // Modifications
    description: 'Beschreibung',
    cost: 'Kosten',
    date: 'Datum',
    addModification: 'Änderung hinzufügen',
    editModification: 'Änderung bearbeiten',
    
    // Units
    km: 'km',
    liters: 'Liter',
    euro: '€',
  },
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fall back to another language with the key present
i18n.enableFallback = true;

// Default to German if device language is not English or German
i18n.defaultLocale = 'de';

export const initializeI18n = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      i18n.locale = savedLanguage;
    } else {
      // Auto-detect device language
      const deviceLocale = Localization.locale;
      if (deviceLocale.startsWith('en')) {
        i18n.locale = 'en';
      } else if (deviceLocale.startsWith('de')) {
        i18n.locale = 'de';
      } else {
        i18n.locale = 'de'; // Default to German
      }
      await AsyncStorage.setItem(LANGUAGE_KEY, i18n.locale);
    }
  } catch (error) {
    console.error('Error initializing i18n:', error);
    i18n.locale = 'de';
  }
};

export const changeLanguage = async (locale: string) => {
  try {
    i18n.locale = locale;
    await AsyncStorage.setItem(LANGUAGE_KEY, locale);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export const getCurrentLanguage = () => i18n.locale;

export default i18n;
