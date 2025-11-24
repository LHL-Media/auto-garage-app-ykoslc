
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';
import { useI18n } from '@/contexts/I18nContext';

console.log('📱 TabLayout (iOS) loaded');

export default function TabLayout() {
  console.log('🏠 TabLayout (iOS) rendering');
  
  const { t } = useI18n();
  
  return (
    <NativeTabs
      backBehavior="history"
      tintColor={colors.primary}
    >
      <NativeTabs.Trigger name="(home)">
        <Label>{t('garage')}</Label>
        <Icon sf="car.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>{t('settings')}</Label>
        <Icon sf="gearshape.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
