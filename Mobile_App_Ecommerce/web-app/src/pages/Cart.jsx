import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart, removeFromCart, updateQuantity, getCartTotal, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      try {
        await removeFromCart(productId);
      } catch (error) {
        alert(error.error || 'Failed to remove item');
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="center">
        <h2>Please login to view your cart</h2>
        <button onClick={() => navigate('/login')} className="button">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {isLoading ? (
        <div className="loading">Loading cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="empty">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="button">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                {item.product?.image && (
                  <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                )}
                <div className="cart-item-info">
                  <h3>{item.product?.name || 'Product'}</h3>
                  <p className="cart-item-price">
                    ${parseFloat(item.product?.price || 0).toFixed(2)} x {item.quantity}
                  </p>
                  <p className="cart-item-total">
                    Total: ${(parseFloat(item.product?.price || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                  </p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <h2>Total: ${getCartTotal().toFixed(2)}</h2>
            </div>
            <button onClick={handleCheckout} className="checkout-button">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

