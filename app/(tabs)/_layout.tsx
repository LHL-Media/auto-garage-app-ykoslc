
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { useI18n } from '@/contexts/I18nContext';

console.log('📱 TabLayout loaded');

export default function TabLayout() {
  console.log('🏠 TabLayout rendering');
  
  const { t } = useI18n();
  
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'directions_car',
      iosIcon: 'car.fill',
      label: t('garage'),
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'settings',
      iosIcon: 'gearshape.fill',
      label: t('settings'),
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
