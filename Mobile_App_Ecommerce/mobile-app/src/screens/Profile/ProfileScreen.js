import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../store/authStore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation handled by AppNavigator
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      <View style={styles.menuSection}>
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={[styles.menuItem, styles.adminMenuItem]}
            onPress={() => navigation.navigate('AdminDashboard')}
          >
            <Text style={[styles.menuText, styles.adminMenuText]}>⚙️ Admin Panel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Shipping Addresses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    marginBottom: 20
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  email: {
    fontSize: 16,
    color: '#666'
  },
  menuSection: {
    backgroundColor: '#fff',
    marginBottom: 20
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  menuText: {
    fontSize: 16,
    color: '#333'
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    margin: 20,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  adminMenuItem: {
    backgroundColor: '#28a745',
    marginBottom: 10,
    borderRadius: 6
  },
  adminMenuText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default ProfileScreen;

