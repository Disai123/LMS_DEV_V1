import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useProductStore from '../../store/productStore';
import * as productService from '../../services/productService';
import './AdminProducts.css';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { products, fetchProducts, isLoading } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    is_active: true
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts({ limit: 100 });
  }, [user, navigate, fetchProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      await fetchProducts({ limit: 100 });
      resetForm();
    } catch (error) {
      alert(error.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      image: product.image || '',
      is_active: product.is_active !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await productService.deleteProduct(productId);
      await fetchProducts({ limit: 100 });
    } catch (error) {
      alert(error.message || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: '',
      is_active: true
    });
  };

  if (isLoading) {
    return <div className="admin-products loading">Loading products...</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <h1>Manage Products</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Active
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">No products found</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id.substring(0, 8)}...</td>
                  <td>{product.name}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>{product.category || '-'}</td>
                  <td>
                    <span className={`status ${product.is_active ? 'active' : 'inactive'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;

