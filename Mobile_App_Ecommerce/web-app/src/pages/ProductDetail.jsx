import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, fetchProduct, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(id, quantity);
      alert('Item added to cart!');
    } catch (error) {
      alert(error.error || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!currentProduct) {
    return <div className="empty">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-detail-layout">
        <div className="product-image-section">
          {currentProduct.image && (
            <img src={currentProduct.image} alt={currentProduct.name} className="detail-image" />
          )}
        </div>

        <div className="product-info-section">
          <h1 className="detail-name">{currentProduct.name}</h1>
          <p className="detail-price">${parseFloat(currentProduct.price).toFixed(2)}</p>
          
          {currentProduct.description && (
            <div className="detail-description">
              <h3>Description</h3>
              <p>{currentProduct.description}</p>
            </div>
          )}

          <div className="detail-stock">
            {currentProduct.stock > 0 ? (
              <span className="in-stock">In Stock ({currentProduct.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {currentProduct.stock > 0 && (
            <div className="detail-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}>+</button>
              </div>
              <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

