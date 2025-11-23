
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

console.log('👤 ProfileScreen loaded');

export default function ProfileScreen() {
  console.log('👤 ProfileScreen rendering');
  
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
            Profile
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
          <View style={styles.cardRow}>
            <IconSymbol
              ios_icon_name="person.circle.fill"
              android_material_icon_name="account_circle"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.cardText, { color: theme.dark ? '#FFF' : colors.text }]}>
              Account Settings
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
          <View style={styles.cardRow}>
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.cardText, { color: theme.dark ? '#FFF' : colors.text }]}>
              Notifications
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
          <View style={styles.cardRow}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.cardText, { color: theme.dark ? '#FFF' : colors.text }]}>
              About
            </Text>
          </View>
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
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
