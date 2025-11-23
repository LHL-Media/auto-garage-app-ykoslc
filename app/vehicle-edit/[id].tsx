
import React, { useState, useEffect, useCallback } from 'react';
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
import { Vehicle, VehicleType } from '@/types/vehicle';
import { StorageService } from '@/utils/storage';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useI18n } from '@/contexts/I18nContext';

console.log('✏️ VehicleEdit loaded');

export default function VehicleEdit() {
  console.log('✏️ VehicleEdit rendering');
  
  const router = useRouter();
  const theme = useTheme();
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  const loadVehicle = useCallback(async () => {
    try {
      const vehicles = await StorageService.getVehicles();
      const vehicle = vehicles.find(v => v.id === id);
      
      if (vehicle) {
        console.log('✅ Vehicle loaded for editing:', vehicle);
        setVehicleType(vehicle.type);
        setMake(vehicle.make);
        setModel(vehicle.model);
        setYear(vehicle.year.toString());
        setVin(vehicle.vin);
        setLicensePlate(vehicle.licensePlate);
        setPurchaseDate(new Date(vehicle.purchaseDate));
        setPurchasePrice(vehicle.purchasePrice > 0 ? vehicle.purchasePrice.toString() : '');
        setCurrentMileage(vehicle.currentMileage.toString());
        setPhotoUri(vehicle.photoUri);
        setNotes(vehicle.notes || '');
      } else {
        Alert.alert(t('error'), t('vehicleNotFound'));
        router.back();
      }
    } catch (error) {
      console.error('❌ Error loading vehicle:', error);
      Alert.alert(t('error'), 'Failed to load vehicle');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router, t]);

  useEffect(() => {
    console.log('🔍 Loading vehicle for editing:', id);
    loadVehicle();
  }, [id, loadVehicle]);

  useEffect(() => {
    setHasChanges(true);
  }, [vehicleType, make, model, year, vin, licensePlate, purchaseDate, purchasePrice, currentMileage, photoUri, notes]);

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
      Alert.alert(t('permissionRequired'), t('cameraPermissionMessage'));
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

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        t('discardChangesTitle'),
        t('discardChangesMessage'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('discardChanges'),
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    console.log('💾 Saving vehicle changes');
    
    if (!make || !model || !year || !licensePlate || !currentMileage) {
      Alert.alert(t('missingInformation'), t('fillRequiredFields'));
      return;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert(t('invalidYear'), `${t('invalidYearMessage')} ${new Date().getFullYear() + 1}`);
      return;
    }

    const mileageNum = parseInt(currentMileage);
    if (isNaN(mileageNum) || mileageNum < 0) {
      Alert.alert(t('invalidMileage'), t('invalidMileageMessage'));
      return;
    }

    if (vin && vin.length !== 17) {
      Alert.alert(t('invalidVIN'), t('invalidVINMessage'));
      return;
    }

    setSaving(true);

    try {
      const vehicle: Vehicle = {
        id,
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

      console.log('💾 Updating vehicle in storage:', vehicle);
      await StorageService.saveVehicle(vehicle);
      console.log('✅ Vehicle updated successfully');
      
      Alert.alert(t('success'), t('vehicleUpdatedSuccess'), [
        {
          text: 'OK',
          onPress: () => {
            console.log('🔙 Navigating back');
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Error updating vehicle:', error);
      Alert.alert(t('error'), 'Failed to update vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('deleteVehicleTitle'),
      t('deleteVehicleMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('deleteConfirmTitle'),
              t('deleteConfirmMessage'),
              [
                { text: t('cancel'), style: 'cancel' },
                {
                  text: t('delete'),
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      console.log('🗑️ Deleting vehicle:', id);
                      await StorageService.deleteVehicle(id);
                      console.log('✅ Vehicle deleted');
                      Alert.alert(t('success'), t('vehicleDeletedSuccess'), [
                        {
                          text: 'OK',
                          onPress: () => router.replace('/(tabs)/(home)/'),
                        },
                      ]);
                    } catch (error) {
                      console.error('❌ Error deleting vehicle:', error);
                      Alert.alert(t('error'), 'Failed to delete vehicle');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('loadingVehicle')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={theme.dark ? '#FFF' : colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('edit')} {t('vehicle')}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
                {t('vehicleType')} *
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
                <Picker.Item label={t('pkw')} value="car" />
                <Picker.Item label={t('motorrad')} value="motorcycle" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.photoContainer, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}
            onPress={() => {
              Alert.alert(
                t('addPhoto'),
                t('choosePhotoSource'),
                [
                  { text: t('camera'), onPress: handleTakePhoto },
                  { text: t('gallery'), onPress: handlePickImage },
                  { text: t('cancel'), style: 'cancel' },
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
                  {t('addPhotoOptional')}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              {t('make')} * <Text style={styles.required}>({t('required')})</Text>
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
              {t('model')} * <Text style={styles.required}>({t('required')})</Text>
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
              {t('year')} * <Text style={styles.required}>({t('required')})</Text>
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
              {t('vin')} <Text style={styles.optional}>({t('optional')} - 17 characters)</Text>
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
              <Text style={styles.errorText}>{t('invalidVINMessage')}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.dark ? '#FFF' : colors.text }]}>
              {t('licensePlate')} * <Text style={styles.required}>({t('required')})</Text>
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
              {t('purchaseDate')} <Text style={styles.optional}>({t('optional')})</Text>
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
              {t('purchasePrice')} ({t('euro')}) <Text style={styles.optional}>({t('optional')})</Text>
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
              {t('currentMileage')} ({t('km')}) * <Text style={styles.required}>({t('required')})</Text>
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
              {t('notes')} <Text style={styles.optional}>({t('optional')})</Text>
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
            onPress={handleCancel}
            disabled={saving}
          >
            <Text style={[styles.cancelButtonText, { color: theme.dark ? '#FFF' : colors.text }]}>
              {t('cancel')}
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
              <Text style={styles.saveButtonText}>{t('saving')}</Text>
            ) : (
              <>
                <IconSymbol
                  ios_icon_name="checkmark"
                  android_material_icon_name="check"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>{t('saveChanges')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={handleDelete}
          disabled={saving}
        >
          <IconSymbol
            ios_icon_name="trash.fill"
            android_material_icon_name="delete"
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.deleteButtonText}>{t('delete')} {t('vehicle')}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
