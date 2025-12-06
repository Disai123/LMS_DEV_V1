import api from './api';

/**
 * Get user's orders
 */
export const getOrders = async (params = {}) => {
  try {
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get single order by ID
 */
export const getOrder = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create new order
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update order status (Admin only)
 */
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

