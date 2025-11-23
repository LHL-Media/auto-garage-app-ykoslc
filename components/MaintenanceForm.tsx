
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
import { MaintenanceRecord } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';

interface MaintenanceFormProps {
  vehicleId: string;
  onSave: () => void;
  onCancel: () => void;
}

export default function MaintenanceForm({ vehicleId, onSave, onCancel }: MaintenanceFormProps) {
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mileage, setMileage] = useState('');
  const [type, setType] = useState('');
  const [cost, setCost] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!mileage || !type || !cost) {
      console.log('Missing required fields');
      return;
    }

    const record: MaintenanceRecord = {
      id: Date.now().toString(),
      vehicleId,
      date: date.toISOString(),
      mileage: parseInt(mileage),
      type,
      cost: parseFloat(cost),
      serviceProvider,
      notes,
      createdAt: new Date().toISOString(),
    };

    await StorageService.saveMaintenanceRecord(record);
    onSave();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
          Add Maintenance Record
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
            Service Type *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={type}
            onChangeText={setType}
            placeholder="e.g., Oil Change, Brake Service"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
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
            Service Provider
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              color: theme.dark ? '#FFF' : colors.text,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            value={serviceProvider}
            onChangeText={setServiceProvider}
            placeholder="e.g., Local Garage"
            placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
            Notes
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
  textArea: {
    minHeight: 100,
    paddingTop: 14,
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
