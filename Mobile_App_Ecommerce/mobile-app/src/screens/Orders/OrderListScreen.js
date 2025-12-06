import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useOrderStore from '../../store/orderStore';
import useAuthStore from '../../store/authStore';

const OrderListScreen = () => {
  const navigation = useNavigation();
  const { orders, fetchOrders, isLoading } = useOrderStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, []);

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.orderTotal}>Total: ${parseFloat(item.total).toFixed(2)}</Text>
      <Text style={styles.orderDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return '#34C759';
      case 'SHIPPED':
        return '#007AFF';
      case 'PROCESSING':
        return '#FF9500';
      case 'CANCELLED':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Text>Please login to view your orders</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <Text>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No orders found</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  list: {
    padding: 15
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600'
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5
  },
  orderDate: {
    fontSize: 14,
    color: '#666'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  }
});

export default OrderListScreen;

