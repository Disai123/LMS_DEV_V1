import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import './Home.css';

const Home = () => {
  const { products, fetchProducts, isLoading, categories, fetchCategories } = useProductStore();
  const { fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchProducts({ featured: true, limit: 6 });
    fetchCategories();
    // Only fetch cart if user is authenticated
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to E-Commerce</h1>
        <p>Discover amazing products at great prices</p>
        <Link to="/products" className="cta-button">
          Shop Now
        </Link>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        {isLoading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty">No products available</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="product-card"
              >
                {product.image && (
                  <img src={product.image} alt={product.name} className="product-image" />
                )}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        {categories.length === 0 ? (
          <div className="empty">No categories available</div>
        ) : (
          <div className="category-list">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category}`}
                className="category-card"
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

