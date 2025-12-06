import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useProductStore from '../../store/productStore';
import useCartStore from '../../store/cartStore';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { products, fetchProducts, isLoading, categories, fetchCategories } = useProductStore();
  const { fetchCart } = useCartStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchProducts({ featured: true, limit: 6 });
    fetchCategories();
    fetchCart();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchProducts({ featured: true, limit: 6 }),
      fetchCategories(),
      fetchCart()
    ]);
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to E-Commerce</Text>
        <Text style={styles.subtitle}>Discover amazing products</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        {isLoading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : products.length === 0 ? (
          <Text style={styles.empty}>No products available</Text>
        ) : (
          <View style={styles.productGrid}>
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
              >
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${parseFloat(product.price).toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        {categories.length === 0 ? (
          <Text style={styles.empty}>No categories available</Text>
        ) : (
          <View style={styles.categoryList}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Products', { category })}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  },
  section: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15
  },
  loading: {
    textAlign: 'center',
    padding: 20,
    color: '#666'
  },
  empty: {
    textAlign: 'center',
    padding: 20,
    color: '#999'
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  productCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold'
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  categoryCard: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  }
});

export default HomeScreen;

