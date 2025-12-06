import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../store/authStore';
import * as productService from '../../services/productService';
import * as orderService from '../../services/orderService';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigation.replace('Home');
      return;
    }
    fetchStats();
  }, [user, navigation]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // Fetch products count
      const productsRes = await productService.getProducts({ limit: 1000 });
      const totalProducts = productsRes.data?.length || 0;

      // Fetch orders
      const ordersRes = await orderService.getOrders({ limit: 1000 });
      const orders = ordersRes.data || [];
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      const totalRevenue = orders
        .filter(o => o.payment_status === 'PAID')
        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

      setStats({
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, {user?.name || 'Admin'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📦</Text>
          <Text style={styles.statValue}>{stats.totalProducts}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
          <TouchableOpacity
            style={styles.statButton}
            onPress={() => navigation.navigate('AdminProducts')}
          >
            <Text style={styles.statButtonText}>Manage →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🛒</Text>
          <Text style={styles.statValue}>{stats.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
          <TouchableOpacity
            style={styles.statButton}
            onPress={() => navigation.navigate('AdminOrders')}
          >
            <Text style={styles.statButtonText}>View →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statValue}>${stats.totalRevenue.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏳</Text>
          <Text style={styles.statValue}>{stats.pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
          <TouchableOpacity
            style={styles.statButton}
            onPress={() => navigation.navigate('AdminOrders', { status: 'PENDING' })}
          >
            <Text style={styles.statButtonText}>Review →</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AdminProducts', { mode: 'create' })}
        >
          <Text style={styles.actionButtonText}>➕ Add New Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AdminProducts')}
        >
          <Text style={styles.actionButtonText}>📦 Manage Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AdminOrders')}
        >
          <Text style={styles.actionButtonText}>🛒 View Orders</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    margin: 5,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  statButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  statButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminDashboardScreen;

