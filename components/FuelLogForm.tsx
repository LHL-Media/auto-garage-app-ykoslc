
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FuelLog } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';

interface FuelLogFormProps {
  vehicleId: string;
  onSave: () => void;
  onCancel: () => void;
}

export default function FuelLogForm({ vehicleId, onSave, onCancel }: FuelLogFormProps) {
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mileage, setMileage] = useState('');
  const [amount, setAmount] = useState('');
  const [cost, setCost] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [station, setStation] = useState('');

  const handleSave = async () => {
    if (!mileage || !amount || !cost || !fuelType) {
      console.log('Missing required fields');
      return;
    }

    const log: FuelLog = {
      id: Date.now().toString(),
      vehicleId,
      date: date.toISOString(),
      mileage: parseInt(mileage),
      amount: parseFloat(amount),
      cost: parseFloat(cost),
      fuelType,
      station,
      createdAt: new Date().toISOString(),
    };

    await StorageService.saveFuelLog(log);
    onSave();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
          Add Fuel Log
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
            Date *
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
            Mileage (km) *
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
            Amount (liters) *
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
            Cost (€) *
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
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            Fuel Type *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={fuelType}
            onChangeText={setFuelType}
            placeholder="e.g., Diesel, Petrol, E10"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            Station
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={station}
            onChangeText={setStation}
            placeholder="e.g., Shell, Aral"
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
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
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
