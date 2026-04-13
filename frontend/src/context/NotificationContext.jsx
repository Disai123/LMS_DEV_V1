import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user, token: authContextToken } = useAuth();
  const token = authContextToken || localStorage.getItem('accessToken');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
      }
    } catch (error) {
      console.error('[NotificationContext] Error fetching notifications:', error.message);
      if (error.response) {
        console.error('[NotificationContext] Server response error:', error.response.status, error.response.data);
      }
    }
  }, [token]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUnreadCount(response.data.data.count);
      }
    } catch (error) {
      console.error('[NotificationContext] Error fetching unread count:', error.message);
    }
  }, [token]);

  // Initialize strictly when user is logged in
  useEffect(() => {
    if (user && token) {
      fetchNotifications();
      fetchUnreadCount();

      // Initialize Socket
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('[NotificationSocket] Connected successfully to http://localhost:5000');
      });

      newSocket.on('connect_error', (error) => {
        console.error('[NotificationSocket] Connection error:', error.message);
        console.error('[NotificationSocket] Target URL: http://localhost:5000');
      });

      newSocket.on('disconnect', (reason) => {
        console.log('[NotificationSocket] Disconnected:', reason);
      });

      newSocket.on('notification', (notification) => {
        // Play sound or show toast based on preferences
        toast.success(`New Notification: ${notification.title}`, {
          icon: '🔔',
          duration: 4000
        });

        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, token, fetchNotifications, fetchUnreadCount]);

  // Mark one as read
  const markAsRead = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => notif.id === id ? { ...notif, is_read: true } : notif)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await axios.patch('http://localhost:5000/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setNotifications(prev => {
          const removed = prev.find(n => n.id === id);
          if (removed && !removed.is_read) {
            setUnreadCount(c => Math.max(0, c - 1));
          }
          return prev.filter(n => n.id !== id);
        });
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
