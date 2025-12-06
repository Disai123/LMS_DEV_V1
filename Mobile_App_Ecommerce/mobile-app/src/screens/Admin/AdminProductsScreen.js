import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../store/authStore';
import useProductStore from '../../store/productStore';
import * as productService from '../../services/productService';

const AdminProductsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { products, fetchProducts, isLoading } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    is_active: true
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigation.replace('Home');
      return;
    }
    fetchProducts({ limit: 100 });
  }, [user, navigation, fetchProducts]);

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      await fetchProducts({ limit: 100 });
      resetForm();
      Alert.alert('Success', editingProduct ? 'Product updated!' : 'Product created!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || '',
      image: product.image || '',
      is_active: product.is_active !== false
    });
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(productId);
              await fetchProducts({ limit: 100 });
              Alert.alert('Success', 'Product deleted!');
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete product');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: '',
      is_active: true
    });
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${parseFloat(item.price).toFixed(2)}</Text>
        <Text style={styles.productStock}>Stock: {item.stock}</Text>
        <Text style={styles.productCategory}>{item.category || 'No category'}</Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
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
        <Text style={styles.title}>Manage Products</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <Modal visible={showForm} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Product Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Price *"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="decimal-pad"
              />

              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Stock *"
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                keyboardType="number-pad"
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Image URL"
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 10,
  },
  productCard: {
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
  productInfo: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  productStock: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 12,
    color: '#999',
  },
  productActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
  },
  editButtonText: {
    color: '#212529',
    textAlign: 'center',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AdminProductsScreen;

