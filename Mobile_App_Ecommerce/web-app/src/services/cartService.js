import api from './api';

/**
 * Get user's cart
 */
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (productId, quantity) => {
  try {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

