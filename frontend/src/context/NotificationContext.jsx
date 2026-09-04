import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import notificationApi from '../services/notificationService';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user, token: authContextToken } = useAuth();
  const token = authContextToken || localStorage.getItem('accessToken');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const response = await notificationApi.getNotifications(token);
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
      }
    } catch (error) {
      console.error('[NotificationContext] Error fetching notifications:', error.message);
    }
  }, [token]);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const response = await notificationApi.getUnreadCount(token);
      if (response.data.success) {
        setUnreadCount(response.data.data.count);
      }
    } catch (error) {
      console.error('[NotificationContext] Error fetching unread count:', error.message);
    }
  }, [token]);

  const refreshNotifications = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    if (!user || !token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    refreshNotifications();

    const socketUrl = notificationApi.getSocketUrl();
    const newSocket = io(socketUrl, { auth: { token } });

    newSocket.on('connect', () => {
      console.log('[NotificationSocket] Connected to', socketUrl);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[NotificationSocket] Connection error:', error.message);
    });

    newSocket.on('notification', (notification) => {
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
  }, [user, token, refreshNotifications]);

  const markAsRead = async (id) => {
    try {
      const response = await notificationApi.markAsRead(token, id);

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

  const markAllAsRead = async () => {
    try {
      const response = await notificationApi.markAllAsRead(token);

      if (response.data.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await notificationApi.deleteNotification(token, id);

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
      fetchNotifications,
      fetchUnreadCount,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
