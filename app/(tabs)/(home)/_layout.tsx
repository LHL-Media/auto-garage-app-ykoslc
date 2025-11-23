
import React from 'react';
import { Stack } from 'expo-router';

console.log('🏠 HomeLayout loaded');

export default function HomeLayout() {
  console.log('🏠 HomeLayout rendering');
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
