import { create } from 'zustand';
import * as cartService from '../services/cartService';

const useCartStore = create((set, get) => ({
  cartItems: [],
  isLoading: false,
  error: null,

  // Fetch cart items
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.getCart();
      set({ cartItems: response.data || [], isLoading: false });
    } catch (error) {
      // If 401 (unauthorized), user is not logged in - set empty cart
      // Don't show error for unauthenticated users
      if (error.response?.status === 401 || error.status === 401) {
        set({ cartItems: [], isLoading: false, error: null });
      } else {
        set({ error: error.error || 'Failed to fetch cart', isLoading: false });
      }
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      await get().fetchCart(); // Refresh cart
      return response;
    } catch (error) {
      set({ error: error.error || 'Failed to add item to cart' });
      throw error;
    }
  },

  // Update cart item quantity
  updateQuantity: async (productId, quantity) => {
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      await get().fetchCart(); // Refresh cart
      return response;
    } catch (error) {
      set({ error: error.error || 'Failed to update cart item' });
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      const response = await cartService.removeFromCart(productId);
      await get().fetchCart(); // Refresh cart
      return response;
    } catch (error) {
      set({ error: error.error || 'Failed to remove item from cart' });
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ cartItems: [] });
    } catch (error) {
      set({ error: error.error || 'Failed to clear cart' });
      throw error;
    }
  },

  // Calculate cart total
  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product?.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return total + (price * quantity);
    }, 0);
  },

  // Get cart items count
  getCartCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((count, item) => count + (parseInt(item.quantity) || 0), 0);
  }
}));

export default useCartStore;

