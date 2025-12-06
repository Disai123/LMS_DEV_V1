import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

const CartScreen = () => {
  const navigation = useNavigation();
  const { cartItems, fetchCart, removeFromCart, updateQuantity, getCartTotal, isLoading } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  }, []);

  const handleRemoveItem = async (productId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFromCart(productId);
            } catch (error) {
              Alert.alert('Error', error.error || 'Failed to remove item');
            }
          }
        }
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Your cart is empty');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product?.name || 'Product'}</Text>
        <Text style={styles.itemPrice}>
          ${parseFloat(item.product?.price || 0).toFixed(2)} x {item.quantity}
        </Text>
        <Text style={styles.itemTotal}>
          Total: ${(parseFloat(item.product?.price || 0) * parseInt(item.quantity || 0)).toFixed(2)}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.productId, item.quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.productId)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Text>Please login to view your cart</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Your cart is empty</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ${getCartTotal().toFixed(2)}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
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
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  itemActions: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center'
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default CartScreen;

