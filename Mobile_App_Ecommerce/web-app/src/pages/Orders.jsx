import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';
import './Orders.css';

const Orders = () => {
  const { orders, fetchOrders, isLoading } = useOrderStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return '#34C759';
      case 'SHIPPED':
        return '#007AFF';
      case 'PROCESSING':
        return '#FF9500';
      case 'CANCELLED':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="center">
        <h2>Please login to view your orders</h2>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {isLoading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty">No orders found</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="order-card"
            >
              <div className="order-header">
                <span className="order-number">{order.orderNumber}</span>
                <span
                  className="order-status"
                  style={{ color: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <p className="order-total">Total: ${parseFloat(order.total).toFixed(2)}</p>
                <p className="order-date">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

