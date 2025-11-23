
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useI18n } from '@/contexts/I18nContext';

console.log('⚙️ ProfileScreen loaded');

export default function ProfileScreen() {
  console.log('⚙️ ProfileScreen rendering');
  
  const theme = useTheme();
  const { t, locale, changeLanguage } = useI18n();

  const handleLanguageChange = async (newLocale: string) => {
    try {
      await changeLanguage(newLocale);
      Alert.alert(t('success'), `${t('language')} ${newLocale === 'de' ? t('german') : t('english')}`);
    } catch (error) {
      console.error('❌ Error changing language:', error);
      Alert.alert(t('error'), 'Failed to change language');
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
          <Text style={[styles.headerTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('settings')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
            {t('language')}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.languageCard,
              { backgroundColor: theme.dark ? '#1C1C1E' : colors.card },
              locale === 'de' && styles.languageCardActive,
            ]}
            onPress={() => handleLanguageChange('de')}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <Text style={styles.flagIcon}>🇩🇪</Text>
              <Text style={[styles.languageText, { color: theme.dark ? '#FFF' : colors.text }]}>
                {t('german')}
              </Text>
            </View>
            {locale === 'de' && (
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageCard,
              { backgroundColor: theme.dark ? '#1C1C1E' : colors.card },
              locale === 'en' && styles.languageCardActive,
            ]}
            onPress={() => handleLanguageChange('en')}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <Text style={styles.flagIcon}>🇬🇧</Text>
              <Text style={[styles.languageText, { color: theme.dark ? '#FFF' : colors.text }]}>
                {t('english')}
              </Text>
            </View>
            {locale === 'en' && (
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
            About
          </Text>
          
          <View style={[styles.infoCard, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                App Version
              </Text>
              <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                1.0.0
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                Current Language
              </Text>
              <Text style={[styles.infoValue, { color: theme.dark ? '#FFF' : colors.text }]}>
                {locale === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
              </Text>
            </View>
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
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  languageCardActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagIcon: {
    fontSize: 32,
  },
  languageText: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 4,
  },
});
