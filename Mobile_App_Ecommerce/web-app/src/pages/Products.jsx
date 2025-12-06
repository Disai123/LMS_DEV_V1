import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useProductStore from '../store/productStore';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const { products, fetchProducts, isLoading, categories, fetchCategories, filters, setFilters } = useProductStore();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProducts({ category: category || '', page: 1, limit: 20 });
    fetchCategories();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchText, page: 1 });
    fetchProducts({ ...filters, search: searchText, page: 1 });
  };

  const handleCategoryFilter = (selectedCategory) => {
    setFilters({ category: selectedCategory, page: 1 });
    fetchProducts({ ...filters, category: selectedCategory, page: 1 });
  };

  return (
    <div className="products-page">
      <h1>Products</h1>

      <div className="products-layout">
        <aside className="sidebar">
          <h3>Categories</h3>
          <div className="category-filters">
            <button
              className={!filters.category ? 'category-filter active' : 'category-filter'}
              onClick={() => handleCategoryFilter('')}
            >
              All
            </button>
            {categories.map((cat, index) => (
              <button
                key={index}
                className={filters.category === cat ? 'category-filter active' : 'category-filter'}
                onClick={() => handleCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <main className="products-main">
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          {isLoading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty">No products found</div>
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
                    {product.stock > 0 ? (
                      <span className="in-stock">In Stock</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;

