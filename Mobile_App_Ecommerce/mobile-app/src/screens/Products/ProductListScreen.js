import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useProductStore from '../../store/productStore';

const ProductListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const category = route.params?.category || '';
  
  const { products, fetchProducts, isLoading, filters, setFilters } = useProductStore();
  const [searchText, setSearchText] = React.useState('');

  useEffect(() => {
    fetchProducts({ category: category || '', page: 1, limit: 20 });
  }, [category]);

  const handleSearch = () => {
    setFilters({ search: searchText, page: 1 });
    fetchProducts({ ...filters, search: searchText, page: 1 });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>${parseFloat(item.price).toFixed(2)}</Text>
        {item.stock > 0 ? (
          <Text style={styles.inStock}>In Stock</Text>
        ) : (
          <Text style={styles.outOfStock}>Out of Stock</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <Text>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No products found</Text>
            </View>
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
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff'
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16
  },
  list: {
    padding: 10
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 5,
    padding: 10,
    maxWidth: '48%'
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 5
  },
  inStock: {
    fontSize: 12,
    color: '#34C759'
  },
  outOfStock: {
    fontSize: 12,
    color: '#FF3B30'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  }
});

export default ProductListScreen;

