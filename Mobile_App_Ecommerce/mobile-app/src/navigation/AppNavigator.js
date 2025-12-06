import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useAuthStore from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminProductsScreen from '../screens/Admin/AdminProductsScreen';
import AdminOrdersScreen from '../screens/Admin/AdminOrdersScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    // Show loading screen
    return null; // You can add a loading component here
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen 
            name="Main" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          {/* Admin Screens - Only accessible to admin users */}
          {user?.role === 'admin' && (
            <>
              <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
                options={{ title: 'Admin Dashboard' }}
              />
              <Stack.Screen
                name="AdminProducts"
                component={AdminProductsScreen}
                options={{ title: 'Manage Products' }}
              />
              <Stack.Screen
                name="AdminOrders"
                component={AdminOrdersScreen}
                options={{ title: 'Manage Orders' }}
              />
            </>
          )}
        </>
      ) : (
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

