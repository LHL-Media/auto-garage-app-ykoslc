
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
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Vehicle, VehicleType } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

console.log('📝 VehicleRegistration loaded');

export default function VehicleRegistration() {
  console.log('📝 VehicleRegistration rendering');
  
  const router = useRouter();
  const theme = useTheme();

  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
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
    console.log('📷 Opening image picker');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('✅ Image selected:', result.assets[0].uri);
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    console.log('📸 Opening camera');
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('✅ Photo taken:', result.assets[0].uri);
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    console.log('💾 Saving vehicle');
    
    if (!make || !model || !year || !licensePlate || !currentMileage) {
      Alert.alert('Missing Information', 'Please fill in all required fields (Make, Model, Year, License Plate, Mileage).');
      return;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert('Invalid Year', 'Please enter a valid year between 1900 and ' + (new Date().getFullYear() + 1));
      return;
    }

    const mileageNum = parseInt(currentMileage);
    if (isNaN(mileageNum) || mileageNum < 0) {
      Alert.alert('Invalid Mileage', 'Please enter a valid mileage (0 or greater).');
      return;
    }

    if (vin && vin.length !== 17) {
      Alert.alert('Invalid VIN', 'VIN must be exactly 17 characters.');
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
        licensePlate: licensePlate.toUpperCase(),
        purchaseDate: purchaseDate.toISOString(),
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : 0,
        currentMileage: mileageNum,
        photoUri,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('💾 Saving vehicle to storage:', vehicle);
      await StorageService.saveVehicle(vehicle);
      console.log('✅ Vehicle saved successfully');
      
      Alert.alert('Success', 'Vehicle added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            console.log('🏠 Navigating back to garage');
            router.replace('/(tabs)/(home)/');
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Error saving vehicle:', error);
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
        keyboardShouldPersistTaps="handled"
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
            Add Vehicle
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
                Vehicle Type *
              </Text>
              <IconSymbol
                ios_icon_name={vehicleType === 'car' ? 'car.fill' : 'bicycle'}
                android_material_icon_name={vehicleType === 'car' ? 'directions_car' : 'motorcycle'}
                size={24}
                color={vehicleType === 'car' ? colors.primary : colors.accent}
              />
            </View>
            <View style={[styles.pickerContainer, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}>
              <Picker
                selectedValue={vehicleType}
                onValueChange={(itemValue) => {
                  console.log('🚗 Vehicle type changed:', itemValue);
                  setVehicleType(itemValue as VehicleType);
                }}
                style={[styles.picker, { color: theme.dark ? '#FFF' : colors.text }]}
                dropdownIconColor={theme.dark ? '#FFF' : colors.text}
              >
                <Picker.Item label="PKW (Car)" value="car" />
                <Picker.Item label="Motorrad (Motorcycle)" value="motorcycle" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.photoContainer, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
            onPress={() => {
              Alert.alert(
                'Add Photo',
                'Choose a photo source',
                [
                  { text: 'Camera', onPress: handleTakePhoto },
                  { text: 'Gallery', onPress: handlePickImage },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
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
                  Add Photo (Optional)
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Make * <Text style={styles.required}>(Required)</Text>
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={make}
              onChangeText={setMake}
              placeholder="e.g., BMW, Honda, Tesla"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Model * <Text style={styles.required}>(Required)</Text>
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={model}
              onChangeText={setModel}
              placeholder="e.g., 3 Series, CBR600RR, Model 3"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Year * <Text style={styles.required}>(Required)</Text>
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={year}
              onChangeText={setYear}
              placeholder={`e.g., ${new Date().getFullYear()}`}
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              VIN <Text style={styles.optional}>(Optional - 17 characters)</Text>
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={vin}
              onChangeText={(text) => setVin(text.toUpperCase())}
              placeholder="Vehicle Identification Number"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              autoCapitalize="characters"
              maxLength={17}
            />
            {vin.length > 0 && vin.length !== 17 && (
              <Text style={styles.errorText}>VIN must be exactly 17 characters</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              License Plate * <Text style={styles.required}>(Required)</Text>
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
                color: theme.dark ? '#FFF' : colors.text,
                borderColor: theme.dark ? '#3A3A3C' : colors.border,
              }]}
              value={licensePlate}
              onChangeText={(text) => setLicensePlate(text.toUpperCase())}
              placeholder="e.g., ABC-123"
              placeholderTextColor={theme.dark ? '#666' : colors.textSecondary}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              Purchase Date <Text style={styles.optional}>(Optional)</Text>
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
              Purchase Price (€) <Text style={styles.optional}>(Optional)</Text>
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
              Current Mileage (km) * <Text style={styles.required}>(Required)</Text>
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
              Notes <Text style={styles.optional}>(Optional)</Text>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, { 
              backgroundColor: theme.dark ? '#1C1C1E' : colors.card,
              borderColor: theme.dark ? '#3A3A3C' : colors.border,
            }]}
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={[styles.cancelButtonText, { color: theme.dark ? '#FFF' : colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { 
              backgroundColor: saving ? colors.textSecondary : colors.primary,
            }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <>
                <IconSymbol
                  ios_icon_name="checkmark"
                  android_material_icon_name="check"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>Save Vehicle</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  required: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
  optional: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 50,
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
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
  photoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 4,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
