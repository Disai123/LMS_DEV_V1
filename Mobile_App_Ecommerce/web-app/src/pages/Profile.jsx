import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-info">
            <h2>{user?.name || 'User'}</h2>
            <p>{user?.email || ''}</p>
          </div>
        </div>

        <div className="profile-menu">
          <button className="menu-item">
            Edit Profile
          </button>
          <button className="menu-item">
            Shipping Addresses
          </button>
          <button className="menu-item">
            Settings
          </button>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

