import { create } from 'zustand';
import * as orderService from '../services/orderService';

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: null,

  // Fetch orders
  fetchOrders: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.getOrders(params);
      set({
        orders: response.data || [],
        pagination: response.pagination || null,
        isLoading: false
      });
    } catch (error) {
      set({ error: error.error || 'Failed to fetch orders', isLoading: false });
    }
  },

  // Fetch single order
  fetchOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.getOrder(id);
      set({ currentOrder: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.error || 'Failed to fetch order', isLoading: false });
      throw error;
    }
  },

  // Create order
  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.createOrder(orderData);
      // Refresh orders list
      await get().fetchOrders();
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.error || 'Failed to create order', isLoading: false });
      throw error;
    }
  }
}));

export default useOrderStore;

