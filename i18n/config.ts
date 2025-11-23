
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
    export: 'Export',
    share: 'Share',
    refresh: 'Refresh',
    
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
    
    // Fuel Types
    benzin: 'Benzin/Petrol',
    diesel: 'Diesel',
    super: 'Super',
    e10: 'E10',
    electric: 'Electric',
    hybrid: 'Hybrid',
    lpg: 'LPG',
    
    // Maintenance Categories
    oil_change: 'Oil Change',
    tire_rotation: 'Tire Rotation',
    brake_service: 'Brake Service',
    inspection: 'Inspection',
    battery: 'Battery',
    air_filter: 'Air Filter',
    cabin_filter: 'Cabin Filter',
    spark_plugs: 'Spark Plugs',
    coolant: 'Coolant',
    transmission: 'Transmission',
    other: 'Other',
    
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
    noData: 'No data available',
    
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
    odometerWarning: 'Odometer Warning',
    
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
    serviceProviderName: 'Service Provider Name',
    serviceProviderPhone: 'Phone',
    serviceProviderAddress: 'Address',
    addMaintenance: 'Add Maintenance',
    editMaintenance: 'Edit Maintenance',
    laborCost: 'Labor Cost',
    partsCost: 'Parts Cost',
    taxCost: 'Tax',
    totalCost: 'Total Cost',
    partsReplaced: 'Parts Replaced',
    warrantyExpiry: 'Warranty Expiry',
    category: 'Category',
    
    // Fuel Log
    fuelAmount: 'Amount',
    fuelCost: 'Cost',
    fuelType: 'Fuel Type',
    station: 'Station',
    addFuelLog: 'Add Fuel Log',
    editFuelLog: 'Edit Fuel Log',
    partialFill: 'Partial Fill',
    pricePerUnit: 'Price per Unit',
    efficiency: 'Efficiency',
    fuelEfficiency: 'Fuel Efficiency',
    costPerKm: 'Cost per km',
    bestEfficiency: 'Best Efficiency',
    worstEfficiency: 'Worst Efficiency',
    priceTrends: 'Price Trends',
    
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
    
    // Reminders
    title: 'Title',
    dueDate: 'Due Date',
    dueMileage: 'Due Mileage',
    reminderType: 'Reminder Type',
    recurring: 'Recurring',
    recurringInterval: 'Recurring Interval',
    completed: 'Completed',
    addReminder: 'Add Reminder',
    editReminder: 'Edit Reminder',
    upcomingReminders: 'Upcoming Reminders',
    
    // Insurance
    insurance: 'Insurance',
    provider: 'Provider',
    policyNumber: 'Policy Number',
    startDate: 'Start Date',
    expiryDate: 'Expiry Date',
    premium: 'Premium',
    coverageType: 'Coverage Type',
    addInsurance: 'Add Insurance',
    editInsurance: 'Edit Insurance',
    
    // Recalls
    recalls: 'Recalls',
    recallTitle: 'Recall Title',
    recallDate: 'Recall Date',
    status: 'Status',
    open: 'Open',
    resolved: 'Resolved',
    resolvedDate: 'Resolved Date',
    addRecall: 'Add Recall',
    editRecall: 'Edit Recall',
    
    // Analytics
    totalCostOfOwnership: 'Total Cost of Ownership',
    monthlyExpenses: 'Monthly Expenses',
    yearlyComparison: 'Yearly Comparison',
    maintenanceCostBreakdown: 'Maintenance Cost Breakdown',
    depreciation: 'Depreciation',
    exportData: 'Export Data',
    exportCSV: 'Export as CSV',
    exportPDF: 'Export as PDF',
    
    // Units
    km: 'km',
    liters: 'liters',
    euro: '€',
    perKm: '/km',
    lPer100km: 'L/100km',
    months: 'months',
    
    // Empty States
    noMaintenanceRecords: 'No maintenance records yet',
    noFuelLogs: 'No fuel logs yet',
    noTripLogs: 'No trip logs yet',
    noModifications: 'No modifications yet',
    noDocuments: 'No documents yet',
    noReminders: 'No reminders yet',
    noInsurance: 'No insurance policies yet',
    noRecalls: 'No recalls yet',
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
    export: 'Exportieren',
    share: 'Teilen',
    refresh: 'Aktualisieren',
    
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
    
    // Fuel Types
    benzin: 'Benzin',
    diesel: 'Diesel',
    super: 'Super',
    e10: 'E10',
    electric: 'Elektrisch',
    hybrid: 'Hybrid',
    lpg: 'LPG',
    
    // Maintenance Categories
    oil_change: 'Ölwechsel',
    tire_rotation: 'Reifenwechsel',
    brake_service: 'Bremsenwartung',
    inspection: 'Inspektion',
    battery: 'Batterie',
    air_filter: 'Luftfilter',
    cabin_filter: 'Innenraumfilter',
    spark_plugs: 'Zündkerzen',
    coolant: 'Kühlmittel',
    transmission: 'Getriebe',
    other: 'Sonstiges',
    
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
    noData: 'Keine Daten verfügbar',
    
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
    odometerWarning: 'Kilometerstand-Warnung',
    
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
    serviceProviderName: 'Name des Serviceanbieters',
    serviceProviderPhone: 'Telefon',
    serviceProviderAddress: 'Adresse',
    addMaintenance: 'Wartung hinzufügen',
    editMaintenance: 'Wartung bearbeiten',
    laborCost: 'Arbeitskosten',
    partsCost: 'Teilekosten',
    taxCost: 'Steuer',
    totalCost: 'Gesamtkosten',
    partsReplaced: 'Ersetzte Teile',
    warrantyExpiry: 'Garantieablauf',
    category: 'Kategorie',
    
    // Fuel Log
    fuelAmount: 'Menge',
    fuelCost: 'Kosten',
    fuelType: 'Kraftstoffart',
    station: 'Tankstelle',
    addFuelLog: 'Tankvorgang hinzufügen',
    editFuelLog: 'Tankvorgang bearbeiten',
    partialFill: 'Teilbetankung',
    pricePerUnit: 'Preis pro Einheit',
    efficiency: 'Effizienz',
    fuelEfficiency: 'Kraftstoffeffizienz',
    costPerKm: 'Kosten pro km',
    bestEfficiency: 'Beste Effizienz',
    worstEfficiency: 'Schlechteste Effizienz',
    priceTrends: 'Preistrends',
    
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
    
    // Reminders
    title: 'Titel',
    dueDate: 'Fälligkeitsdatum',
    dueMileage: 'Fälliger Kilometerstand',
    reminderType: 'Erinnerungstyp',
    recurring: 'Wiederkehrend',
    recurringInterval: 'Wiederholungsintervall',
    completed: 'Abgeschlossen',
    addReminder: 'Erinnerung hinzufügen',
    editReminder: 'Erinnerung bearbeiten',
    upcomingReminders: 'Anstehende Erinnerungen',
    
    // Insurance
    insurance: 'Versicherung',
    provider: 'Anbieter',
    policyNumber: 'Policennummer',
    startDate: 'Startdatum',
    expiryDate: 'Ablaufdatum',
    premium: 'Prämie',
    coverageType: 'Deckungsart',
    addInsurance: 'Versicherung hinzufügen',
    editInsurance: 'Versicherung bearbeiten',
    
    // Recalls
    recalls: 'Rückrufe',
    recallTitle: 'Rückruftitel',
    recallDate: 'Rückrufdatum',
    status: 'Status',
    open: 'Offen',
    resolved: 'Gelöst',
    resolvedDate: 'Lösungsdatum',
    addRecall: 'Rückruf hinzufügen',
    editRecall: 'Rückruf bearbeiten',
    
    // Analytics
    totalCostOfOwnership: 'Gesamtbetriebskosten',
    monthlyExpenses: 'Monatliche Ausgaben',
    yearlyComparison: 'Jahresvergleich',
    maintenanceCostBreakdown: 'Wartungskostenaufschlüsselung',
    depreciation: 'Wertverlust',
    exportData: 'Daten exportieren',
    exportCSV: 'Als CSV exportieren',
    exportPDF: 'Als PDF exportieren',
    
    // Units
    km: 'km',
    liters: 'Liter',
    euro: '€',
    perKm: '/km',
    lPer100km: 'L/100km',
    months: 'Monate',
    
    // Empty States
    noMaintenanceRecords: 'Noch keine Wartungseinträge',
    noFuelLogs: 'Noch keine Tankvorgänge',
    noTripLogs: 'Noch keine Fahrten',
    noModifications: 'Noch keine Änderungen',
    noDocuments: 'Noch keine Dokumente',
    noReminders: 'Noch keine Erinnerungen',
    noInsurance: 'Noch keine Versicherungspolicen',
    noRecalls: 'Noch keine Rückrufe',
  },
};

const i18n = new I18n(translations);

// Get device locale using the new API
const locales = Localization.getLocales();
const deviceLocale = locales[0]?.languageCode || 'de';

// Set the locale once at the beginning of your app
i18n.locale = deviceLocale;

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
      // Auto-detect device language using the new API
      const locales = Localization.getLocales();
      const deviceLanguageCode = locales[0]?.languageCode || 'de';
      
      if (deviceLanguageCode.startsWith('en')) {
        i18n.locale = 'en';
      } else if (deviceLanguageCode.startsWith('de')) {
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
