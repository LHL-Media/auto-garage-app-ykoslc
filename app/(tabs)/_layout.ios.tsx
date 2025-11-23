
import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';
import { useI18n } from '@/contexts/I18nContext';

console.log('📱 TabLayout (iOS) loaded');

export default function TabLayout() {
  console.log('🏠 TabLayout (iOS) rendering');
  
  const { t } = useI18n();
  
  return (
    <NativeTabs
      backBehavior="history"
      tabBarActiveTintColor={colors.primary}
    >
      <NativeTabs.Screen
        name="(home)"
        options={{
          title: t('garage'),
          tabBarIcon: ({ color }) => ({
            ios: {
              name: 'car.fill',
            },
          }),
        }}
      />
      <NativeTabs.Screen
        name="profile"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color }) => ({
            ios: {
              name: 'gearshape.fill',
            },
          }),
        }}
      />
    </NativeTabs>
  );
}
