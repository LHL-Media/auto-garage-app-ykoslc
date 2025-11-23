
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FuelLog, FuelType } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';
import { useI18n } from '@/contexts/I18nContext';
import { AnalyticsService } from '@/utils/analytics';

interface EnhancedFuelLogFormProps {
  vehicleId: string;
  currentMileage: number;
  existingLog?: FuelLog;
  onSave: () => void;
  onCancel: () => void;
}

export default function EnhancedFuelLogForm({ 
  vehicleId, 
  currentMileage,
  existingLog,
  onSave, 
  onCancel 
}: EnhancedFuelLogFormProps) {
  const theme = useTheme();
  const { t } = useI18n();
  
  const [date, setDate] = useState(existingLog ? new Date(existingLog.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mileage, setMileage] = useState(existingLog?.mileage.toString() || '');
  const [amount, setAmount] = useState(existingLog?.amount.toString() || '');
  const [cost, setCost] = useState(existingLog?.cost.toString() || '');
  const [fuelType, setFuelType] = useState<FuelType>(existingLog?.fuelType || 'benzin');
  const [partialFill, setPartialFill] = useState(existingLog?.partialFill || false);
  const [station, setStation] = useState(existingLog?.station || '');

  const fuelTypes: FuelType[] = ['benzin', 'diesel', 'super', 'e10', 'electric', 'hybrid', 'lpg'];

  const handleSave = async () => {
    if (!mileage || !amount || !cost) {
      Alert.alert(t('missingInformation'), t('fillRequiredFields'));
      return;
    }

    const mileageNum = parseInt(mileage);
    
    // Validate odometer
    if (!existingLog) {
      const validation = AnalyticsService.validateOdometer(mileageNum, currentMileage);
      if (!validation.valid) {
        Alert.alert(t('odometerWarning'), validation.message);
        return;
      }
    }

    const pricePerUnit = parseFloat(cost) / parseFloat(amount);

    const log: FuelLog = {
      id: existingLog?.id || Date.now().toString(),
      vehicleId,
      date: date.toISOString(),
      mileage: mileageNum,
      amount: parseFloat(amount),
      cost: parseFloat(cost),
      fuelType,
      partialFill,
      station,
      pricePerUnit,
      createdAt: existingLog?.createdAt || new Date().toISOString(),
    };

    await StorageService.saveFuelLog(log);
    
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
          {existingLog ? t('editFuelLog') : t('addFuelLog')}
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
            {t('fuelType')} *
          </Text>
          <View style={[styles.pickerContainer, { 
            backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
            borderColor: theme.dark ? '#3A3A3C' : colors.border,
          }]}>
            <Picker
              selectedValue={fuelType}
              onValueChange={(value) => setFuelType(value as FuelType)}
              style={[styles.picker, { color: theme.dark ? '#FFF' : colors.text }]}
            >
              {fuelTypes.map((type) => (
                <Picker.Item key={type} label={t(type)} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('fuelAmount')} ({t('liters')}) *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('cost')} ({t('euro')}) *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={cost}
            onChangeText={setCost}
            placeholder="0.00"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
            keyboardType="decimal-pad"
          />
          {amount && cost && (
            <Text style={[styles.helperText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
              {t('pricePerUnit')}: {t('euro')}{(parseFloat(cost) / parseFloat(amount)).toFixed(3)}/{t('liters')}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.switchRow}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              {t('partialFill')}
            </Text>
            <Switch
              value={partialFill}
              onValueChange={setPartialFill}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={partialFill ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
          <Text style={[styles.helperText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            Check if tank was not filled completely (affects efficiency calculation)
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('station')}
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={station}
            onChangeText={setStation}
            placeholder="e.g., Shell, Aral, Total"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
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
