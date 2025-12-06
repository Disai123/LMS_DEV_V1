import api from './api';

/**
 * Get all products with pagination and filters
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get single product by ID
 */
export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all categories
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create new product (Admin only)
 */
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update product (Admin only)
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete product (Admin only)
 */
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

