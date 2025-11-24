
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useI18n } from '@/contexts/I18nContext';

console.log('👤 ProfileScreen (iOS) loaded');

export default function ProfileScreen() {
  console.log('👤 ProfileScreen (iOS) rendering');
  
  const theme = useTheme();
  const { t, locale, changeLanguage } = useI18n();

  const handleLanguageChange = async (newLocale: string) => {
    try {
      await changeLanguage(newLocale);
      Alert.alert(t('success'), `${t('language')}: ${newLocale === 'de' ? t('german') : t('english')}`);
    } catch (error) {
      console.error('❌ Error changing language:', error);
      Alert.alert(t('error'), 'Failed to change language');
    }
  };

  const handleExportData = () => {
    Alert.alert(
      t('exportData'),
      'Export your vehicle data as CSV or PDF for tax purposes and record keeping.',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('exportCSV'), onPress: () => console.log('Export CSV') },
        { text: t('exportPDF'), onPress: () => console.log('Export PDF') },
      ]
    );
  };

  const handleBackup = () => {
    Alert.alert(
      'Cloud Backup',
      'To enable cloud backup, please connect to Supabase by pressing the Supabase button in the Natively interface.',
      [{ text: 'OK' }]
    );
  };

  const settingsItems = [
    {
      icon: 'arrow_downward',
      iosIcon: 'arrow.down.circle.fill',
      title: t('exportData'),
      subtitle: 'Export as CSV or PDF',
      onPress: handleExportData,
    },
    {
      icon: 'cloud_upload',
      iosIcon: 'icloud.and.arrow.up.fill',
      title: 'Cloud Backup',
      subtitle: 'Backup to Supabase',
      onPress: handleBackup,
    },
    {
      icon: 'notifications',
      iosIcon: 'bell.fill',
      title: 'Notifications',
      subtitle: 'Manage reminder alerts',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: 'palette',
      iosIcon: 'paintpalette.fill',
      title: 'Appearance',
      subtitle: 'Light/Dark mode (Auto)',
      onPress: () => console.log('Appearance'),
    },
  ];

  const aboutItems = [
    {
      icon: 'info',
      iosIcon: 'info.circle.fill',
      title: 'About',
      subtitle: 'Version 1.0.0',
      onPress: () => console.log('About'),
    },
    {
      icon: 'help',
      iosIcon: 'questionmark.circle.fill',
      title: 'Help & Support',
      subtitle: 'Get help with the app',
      onPress: () => console.log('Help'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? '#000' : colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              size={48}
              color="#FFFFFF"
            />
          </View>
          <Text style={[styles.headerTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
            Vehicle Manager
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            Manage your garage and settings
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
          <Text style={[styles.sectionTitle, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            SETTINGS
          </Text>
          <View style={[styles.card, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
            {settingsItems.map((item, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    index < settingsItems.length - 1 && styles.listItemBorder,
                    { borderBottomColor: theme.dark ? '#3A3A3C' : colors.border },
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
                    <IconSymbol
                      ios_icon_name={item.iosIcon}
                      android_material_icon_name={item.icon}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.listItemContent}>
                    <Text style={[styles.listItemTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.listItemSubtitle, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <IconSymbol
                    ios_icon_name="chevron.right"
                    android_material_icon_name="chevron_right"
                    size={20}
                    color={theme.dark ? '#666' : colors.textSecondary}
                  />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
            ABOUT
          </Text>
          <View style={[styles.card, { backgroundColor: theme.dark ? '#1C1C1E' : colors.card }]}>
            {aboutItems.map((item, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    index < aboutItems.length - 1 && styles.listItemBorder,
                    { borderBottomColor: theme.dark ? '#3A3A3C' : colors.border },
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconCircle, { backgroundColor: colors.secondary + '20' }]}>
                    <IconSymbol
                      ios_icon_name={item.iosIcon}
                      android_material_icon_name={item.icon}
                      size={24}
                      color={colors.secondary}
                    />
                  </View>
                  <View style={styles.listItemContent}>
                    <Text style={[styles.listItemTitle, { color: theme.dark ? '#FFF' : colors.text }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.listItemSubtitle, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <IconSymbol
                    ios_icon_name="chevron.right"
                    android_material_icon_name="chevron_right"
                    size={20}
                    color={theme.dark ? '#666' : colors.textSecondary}
                  />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.dark ? '#666' : colors.textSecondary }]}>
            Made with ❤️ for vehicle enthusiasts
          </Text>
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
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
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
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  listItemBorder: {
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
  },
});
