import { create } from 'zustand';
import * as productService from '../services/productService';

const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 10,
    search: '',
    category: '',
    featured: false
  },

  // Fetch products
  fetchProducts: async (filters = {}) => {
    set({ isLoading: true, error: null, filters: { ...get().filters, ...filters } });
    try {
      const response = await productService.getProducts(get().filters);
      set({
        products: response.data || [],
        pagination: response.pagination || null,
        isLoading: false
      });
    } catch (error) {
      set({ error: error.error || 'Failed to fetch products', isLoading: false });
    }
  },

  // Fetch single product
  fetchProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProduct(id);
      set({ currentProduct: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.error || 'Failed to fetch product', isLoading: false });
      throw error;
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await productService.getCategories();
      set({ categories: response.data || [] });
    } catch (error) {
      set({ error: error.error || 'Failed to fetch categories' });
    }
  },

  // Set filters
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  // Reset filters
  resetFilters: () => {
    set({
      filters: {
        page: 1,
        limit: 10,
        search: '',
        category: '',
        featured: false
      }
    });
  }
}));

export default useProductStore;

