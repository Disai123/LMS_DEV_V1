import axios from 'axios';

const getApiBase = () => {
  if (import.meta.env.PROD) {
    return '/api';
  }
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${base.replace(/\/$/, '')}/api`;
};

const getSocketBase = () => {
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  return (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
};

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const notificationApi = {
  getBaseUrl: getApiBase,
  getSocketUrl: getSocketBase,

  getNotifications: (token, page = 1, limit = 50) =>
    axios.get(`${getApiBase()}/notifications`, { ...authHeaders(token), params: { page, limit } }),

  getUnreadCount: (token) =>
    axios.get(`${getApiBase()}/notifications/unread-count`, authHeaders(token)),

  markAsRead: (token, id) =>
    axios.patch(`${getApiBase()}/notifications/${id}/read`, {}, authHeaders(token)),

  markAllAsRead: (token) =>
    axios.patch(`${getApiBase()}/notifications/read-all`, {}, authHeaders(token)),

  deleteNotification: (token, id) =>
    axios.delete(`${getApiBase()}/notifications/${id}`, authHeaders(token))
};

export default notificationApi;
