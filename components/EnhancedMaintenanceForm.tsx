
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { MaintenanceRecord, MaintenanceCategory } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';
import { useI18n } from '@/contexts/I18nContext';
import { AnalyticsService } from '@/utils/analytics';

interface EnhancedMaintenanceFormProps {
  vehicleId: string;
  currentMileage: number;
  existingRecord?: MaintenanceRecord;
  onSave: () => void;
  onCancel: () => void;
}

export default function EnhancedMaintenanceForm({ 
  vehicleId, 
  currentMileage,
  existingRecord,
  onSave, 
  onCancel 
}: EnhancedMaintenanceFormProps) {
  const theme = useTheme();
  const { t } = useI18n();
  
  const [date, setDate] = useState(existingRecord ? new Date(existingRecord.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mileage, setMileage] = useState(existingRecord?.mileage.toString() || '');
  const [category, setCategory] = useState<MaintenanceCategory>(existingRecord?.category || 'oil_change');
  const [laborCost, setLaborCost] = useState(existingRecord?.laborCost.toString() || '0');
  const [partsCost, setPartsCost] = useState(existingRecord?.partsCost.toString() || '0');
  const [taxCost, setTaxCost] = useState(existingRecord?.taxCost.toString() || '0');
  const [serviceProviderName, setServiceProviderName] = useState(existingRecord?.serviceProviderName || '');
  const [serviceProviderPhone, setServiceProviderPhone] = useState(existingRecord?.serviceProviderPhone || '');
  const [serviceProviderAddress, setServiceProviderAddress] = useState(existingRecord?.serviceProviderAddress || '');
  const [notes, setNotes] = useState(existingRecord?.notes || '');
  const [partsReplaced, setPartsReplaced] = useState(existingRecord?.partsReplaced?.join(', ') || '');
  const [warrantyExpiry, setWarrantyExpiry] = useState(
    existingRecord?.warrantyExpiry ? new Date(existingRecord.warrantyExpiry) : null
  );
  const [showWarrantyPicker, setShowWarrantyPicker] = useState(false);

  const categories: MaintenanceCategory[] = [
    'oil_change',
    'tire_rotation',
    'brake_service',
    'inspection',
    'battery',
    'air_filter',
    'cabin_filter',
    'spark_plugs',
    'coolant',
    'transmission',
    'other',
  ];

  const calculateTotalCost = () => {
    const labor = parseFloat(laborCost) || 0;
    const parts = parseFloat(partsCost) || 0;
    const tax = parseFloat(taxCost) || 0;
    return labor + parts + tax;
  };

  const handleSave = async () => {
    if (!mileage) {
      Alert.alert(t('missingInformation'), t('fillRequiredFields'));
      return;
    }

    const mileageNum = parseInt(mileage);
    
    // Validate odometer
    if (!existingRecord) {
      const validation = AnalyticsService.validateOdometer(mileageNum, currentMileage);
      if (!validation.valid) {
        Alert.alert(t('odometerWarning'), validation.message);
        return;
      }
    }

    const totalCost = calculateTotalCost();

    const record: MaintenanceRecord = {
      id: existingRecord?.id || Date.now().toString(),
      vehicleId,
      date: date.toISOString(),
      mileage: mileageNum,
      category,
      serviceProviderName,
      serviceProviderPhone,
      serviceProviderAddress,
      laborCost: parseFloat(laborCost) || 0,
      partsCost: parseFloat(partsCost) || 0,
      taxCost: parseFloat(taxCost) || 0,
      totalCost,
      notes,
      partsReplaced: partsReplaced ? partsReplaced.split(',').map(p => p.trim()).filter(p => p) : [],
      warrantyExpiry: warrantyExpiry?.toISOString(),
      createdAt: existingRecord?.createdAt || new Date().toISOString(),
    };

    await StorageService.saveMaintenanceRecord(record);
    
    // Update vehicle mileage if this is the latest entry
    if (mileageNum > currentMileage) {
      const vehicles = await StorageService.getVehicles();
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        vehicle.currentMileage = mileageNum;
        vehicle.updatedAt = new Date().toISOString();
        await StorageService.saveVehicle(vehicle);
      }
    }
    
    onSave();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
          {existingRecord ? t('editMaintenance') : t('addMaintenance')}
        </Text>
        <TouchableOpacity onPress={onCancel}>
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={24}
            color={theme.dark ? '#FFF' : colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('date')} *
          </Text>
          <TouchableOpacity
            style={[styles.input, styles.dateInput, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: theme.dark ? '#FFF' : colors.text }}>
              {date.toLocaleDateString()}
            </Text>
            <IconSymbol
              ios_icon_name="calendar"
              android_material_icon_name="calendar_today"
              size={20}
              color={theme.dark ? '#AAA' : colors.textSecondary}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('mileage')} ({t('km')}) *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={mileage}
            onChangeText={setMileage}
            placeholder="0"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('category')} *
          </Text>
          <View style={[styles.pickerContainer, { 
            backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
            borderColor: theme.dark ? '#3A3A3C' : colors.border,
          }]}>
            <Picker
              selectedValue={category}
              onValueChange={(value) => setCategory(value as MaintenanceCategory)}
              style={[styles.picker, { color: theme.dark ? '#FFF' : colors.text }]}
            >
              {categories.map((cat) => (
                <Picker.Item key={cat} label={t(cat)} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.costSection}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('costBreakdown')}
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              {t('laborCost')} ({t('euro')})
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={laborCost}
              onChangeText={setLaborCost}
              placeholder="0.00"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              {t('partsCost')} ({t('euro')})
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={partsCost}
              onChangeText={setPartsCost}
              placeholder="0.00"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              {t('taxCost')} ({t('euro')})
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={taxCost}
              onChangeText={setTaxCost}
              placeholder="0.00"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.totalCostCard, { backgroundColor: theme.dark ? '#2C2C2E' : colors.card }]}>
            <Text style={[styles.totalCostLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              {t('totalCost')}
            </Text>
            <Text style={[styles.totalCostValue, { color: theme.dark ? '#FFF' : colors.text }]}>
              {t('euro')}{calculateTotalCost().toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('serviceProvider')}
          </Text>
          
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('serviceProviderName')}
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={serviceProviderName}
            onChangeText={setServiceProviderName}
            placeholder="e.g., Local Garage"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('serviceProviderPhone')}
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={serviceProviderPhone}
            onChangeText={setServiceProviderPhone}
            placeholder="+49 123 456789"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('serviceProviderAddress')}
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={serviceProviderAddress}
            onChangeText={setServiceProviderAddress}
            placeholder="Street, City, Postal Code"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('partsReplaced')}
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={partsReplaced}
            onChangeText={setPartsReplaced}
            placeholder="e.g., Oil filter, Air filter (comma separated)"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('warrantyExpiry')}
          </Text>
          <TouchableOpacity
            style={[styles.input, styles.dateInput, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            onPress={() => setShowWarrantyPicker(true)}
          >
            <Text style={{ color: theme.dark ? '#FFF' : colors.text }}>
              {warrantyExpiry ? warrantyExpiry.toLocaleDateString() : t('optional')}
            </Text>
            <IconSymbol
              ios_icon_name="calendar"
              android_material_icon_name="calendar_today"
              size={20}
              color={theme.dark ? '#AAA' : colors.textSecondary}
            />
          </TouchableOpacity>
          {showWarrantyPicker && (
            <DateTimePicker
              value={warrantyExpiry || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowWarrantyPicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setWarrantyExpiry(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('notes')}
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton, { borderColor: theme.dark ? '#3A3A3C' : colors.border }]}
          onPress={onCancel}
        >
          <Text style={[styles.cancelButtonText, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('cancel')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  costSection: {
    gap: 12,
  },
  totalCostCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  totalCostLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalCostValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {},
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
