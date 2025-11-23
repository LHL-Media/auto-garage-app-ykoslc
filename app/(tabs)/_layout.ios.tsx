
import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs
      backBehavior="history"
      tabBarActiveTintColor={colors.primary}
    >
      <NativeTabs.Screen
        name="(home)"
        options={{
          title: 'Garage',
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
          title: 'Profile',
          tabBarIcon: ({ color }) => ({
            ios: {
              name: 'person.fill',
            },
          }),
        }}
      />
    </NativeTabs>
  );
}
