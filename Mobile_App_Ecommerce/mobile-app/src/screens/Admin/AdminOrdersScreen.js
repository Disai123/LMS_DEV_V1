import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Picker,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../store/authStore';
import * as orderService from '../../services/orderService';

const AdminOrdersScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigation.replace('Home');
      return;
    }
    fetchOrders();
  }, [user, navigation, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrders({ limit: 100 });
      let filteredOrders = response.data || [];
      
      if (selectedStatus !== 'ALL') {
        filteredOrders = filteredOrders.filter(o => o.status === selectedStatus);
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', error.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      Alert.alert('Success', 'Order status updated!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ffc107',
      PROCESSING: '#17a2b8',
      SHIPPED: '#007bff',
      DELIVERED: '#28a745',
      CANCELLED: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.order_number}</Text>
          <Text style={styles.customerName}>
            {item.user?.name || item.user?.email || 'N/A'}
          </Text>
          <Text style={styles.orderDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>Total: ${parseFloat(item.total).toFixed(2)}</Text>
        <Text style={styles.paymentStatus}>
          Payment: {item.payment_status || 'N/A'}
        </Text>
      </View>

      <View style={styles.orderActions}>
        <Text style={styles.statusLabel}>Update Status:</Text>
        <View style={styles.statusButtons}>
          {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                item.status === status && styles.statusButtonActive
              ]}
              onPress={() => {
                if (item.status !== status) {
                  Alert.alert(
                    'Update Status',
                    `Change order status to ${status}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Update',
                        onPress: () => handleStatusUpdate(item.id, status)
                      }
                    ]
                  );
                }
              }}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  item.status === status && styles.statusButtonTextActive
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Orders</Text>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Status:</Text>
        <View style={styles.filterButtons}>
          {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.filterButtonActive
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedStatus === status && styles.filterButtonTextActive
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </View>
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
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  list: {
    padding: 10,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  paymentStatus: {
    fontSize: 14,
    color: '#666',
  },
  orderActions: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  statusButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  statusButtonText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default AdminOrdersScreen;

