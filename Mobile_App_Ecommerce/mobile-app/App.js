import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import useAuthStore from './src/store/authStore';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth state from storage
    initialize();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppNavigator />
    </NavigationContainer>
  );
}

