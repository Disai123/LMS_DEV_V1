import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getCartCount } = useCartStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>E-Commerce</h1>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-link admin-link">
                  Admin
                </Link>
              )}
              <Link to="/cart" className="nav-link">
                Cart ({getCartCount()})
              </Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

