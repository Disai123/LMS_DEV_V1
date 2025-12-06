import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import * as orderService from '../../services/orderService';
import './AdminOrders.css';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'ALL');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrders({ limit: 100 });
      let filteredOrders = response.data || [];
      
      if (selectedStatus !== 'ALL') {
        filteredOrders = filteredOrders.filter(o => o.status === selectedStatus);
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert(error.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (error) {
      alert(error.message || 'Failed to update order status');
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      PENDING: 'pending',
      PROCESSING: 'processing',
      SHIPPED: 'shipped',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled'
    };
    return statusMap[status] || 'pending';
  };

  if (isLoading) {
    return <div className="admin-orders loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h1>Manage Orders</h1>
        <div className="status-filter">
          <button
            className={selectedStatus === 'ALL' ? 'active' : ''}
            onClick={() => setSelectedStatus('ALL')}
          >
            All
          </button>
          <button
            className={selectedStatus === 'PENDING' ? 'active' : ''}
            onClick={() => setSelectedStatus('PENDING')}
          >
            Pending
          </button>
          <button
            className={selectedStatus === 'PROCESSING' ? 'active' : ''}
            onClick={() => setSelectedStatus('PROCESSING')}
          >
            Processing
          </button>
          <button
            className={selectedStatus === 'SHIPPED' ? 'active' : ''}
            onClick={() => setSelectedStatus('SHIPPED')}
          >
            Shipped
          </button>
          <button
            className={selectedStatus === 'DELIVERED' ? 'active' : ''}
            onClick={() => setSelectedStatus('DELIVERED')}
          >
            Delivered
          </button>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">No orders found</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.user?.name || order.user?.email || 'N/A'}</td>
                  <td>${parseFloat(order.total).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-badge ${order.payment_status?.toLowerCase()}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
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

export default AdminOrders;

