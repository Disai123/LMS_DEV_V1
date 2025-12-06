import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import * as productService from '../../services/productService';
import * as orderService from '../../services/orderService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // Fetch products count
      const productsRes = await productService.getProducts({ limit: 1000 });
      const totalProducts = productsRes.data?.length || 0;

      // Fetch orders (admin can see all orders - we'll need to add this endpoint)
      // For now, we'll calculate from available data
      const ordersRes = await orderService.getOrders({ limit: 1000 });
      const orders = ordersRes.data || [];
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      const totalRevenue = orders
        .filter(o => o.payment_status === 'PAID')
        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

      setStats({
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="admin-dashboard loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name || 'Admin'}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/admin/products')}
          >
            Manage →
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/admin/orders')}
          >
            View →
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/admin/orders?status=PENDING')}
          >
            Review →
          </button>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn"
            onClick={() => navigate('/admin/products/new')}
          >
            ➕ Add New Product
          </button>
          <button 
            className="action-btn"
            onClick={() => navigate('/admin/products')}
          >
            📦 Manage Products
          </button>
          <button 
            className="action-btn"
            onClick={() => navigate('/admin/orders')}
          >
            🛒 View Orders
          </button>
          <button 
            className="action-btn"
            onClick={() => navigate('/admin/users')}
          >
            👥 Manage Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

