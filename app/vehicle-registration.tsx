
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Vehicle } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function VehicleRegistration() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const vehicleType = params.type as 'car' | 'motorcycle';

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vin, setVin] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!make || !model || !year || !licensePlate || !currentMileage) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert('Invalid Year', 'Please enter a valid year.');
      return;
    }

    const mileageNum = parseInt(currentMileage);
    if (isNaN(mileageNum) || mileageNum < 0) {
      Alert.alert('Invalid Mileage', 'Please enter a valid mileage.');
      return;
    }

    setSaving(true);

    try {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        type: vehicleType,
        make,
        model,
        year: yearNum,
        vin,
        licensePlate,
        purchaseDate: purchaseDate.toISOString(),
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : 0,
        currentMileage: mileageNum,
        photoUri,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await StorageService.saveVehicle(vehicle);
      Alert.alert('Success', 'Vehicle added successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/(home)/'),
        },
      ]);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      Alert.alert('Error', 'Failed to save vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={theme.dark ? '#FFF' : colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
            Add {vehicleType === 'car' ? 'Car' : 'Motorcycle'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.photoContainer, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
          onPress={handlePickImage}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <IconSymbol
                ios_icon_name="camera.fill"
                android_material_icon_name="add_a_photo"
                size={48}
                color={theme.dark ? '#666' : colors.textSecondary}
              />
              <Text style={[styles.photoText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                Add Photo
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Make *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={make}
              onChangeText={setMake}
              placeholder="e.g., BMW, Honda"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Model *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={model}
              onChangeText={setModel}
              placeholder="e.g., 3 Series, CBR600RR"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Year *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={year}
              onChangeText={setYear}
              placeholder="e.g., 2020"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              VIN
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={vin}
              onChangeText={setVin}
              placeholder="Vehicle Identification Number"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              License Plate *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="e.g., ABC-123"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Purchase Date
            </Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: theme.dark ? '#FFF' : colors.text }}>
                {purchaseDate.toLocaleDateString()}
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
                value={purchaseDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setPurchaseDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Purchase Price (€)
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="0.00"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Current Mileage (km) *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={currentMileage}
              onChangeText={setCurrentMileage}
              placeholder="0"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              keyboardType="numeric"
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
              placeholder="Additional notes about your vehicle"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Vehicle'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  photoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
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
  saveButton: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
