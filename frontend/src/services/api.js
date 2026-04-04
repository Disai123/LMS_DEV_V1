import axios from 'axios';

const getBaseUrl = () => {
  // If we're in production (running from build), use the relative path /api
  // If we're in development (running locally on port 5173), use http://localhost:5000/api
  if (import.meta.env.PROD) {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getBaseUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  googleCallback: (token, refresh, isNew) => {
    // This is handled by the redirect from backend, but if we needed to manual exchange:
    // We just store the tokens provided in URL
    return { success: true };
  },
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAuthStatus: () => api.get('/auth/status'),
  refreshToken: (token) => api.post('/auth/refresh-token', { refreshToken: token }),
  logout: () => api.post('/auth/logout'),
};

export const courseService = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  enrollCourse: (id) => api.post(`/courses/${id}/enroll`),
  updateProgress: (courseId, chapterId, completed) =>
    api.post(`/courses/${courseId}/chapters/${chapterId}/progress`, { completed }),
  getCourseProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
};

// ... existing services

export const projectService = {
  getProjects: (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
    if (filters.difficulty && filters.difficulty !== 'all') queryParams.append('difficulty', filters.difficulty);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sort) queryParams.append('sort', filters.sort);

    return api.get(`/realtime-projects/list?${queryParams.toString()}`);
  },
  getProjectInfo: (projectId) => api.get(`/realtime-projects/${projectId}/info`),
  getProjectUrl: (projectId) => `${API_URL}/realtime-projects/${projectId}/index.html`,
};

export const paymentService = {
  getPlans: () => api.get('/payment/plans'),
  submitTransaction: (planId, transactionId) => api.post('/payment/submit-transaction', { plan_id: planId, transaction_id: transactionId }),
  getMySubscription: () => api.get('/payment/subscription'),
  getSubscriptionStats: () => api.get('/payment/admin/stats'),
  getPackageStats: () => api.get('/payment/admin/package-stats'),
  getAllSubscriptions: () => api.get('/payment/admin/subscriptions/all'),
  getPaymentRequests: (status) => api.get(`/payment/admin/payment-requests${status ? `?status=${status}` : ''}`),
  approvePaymentRequest: (id, adminNotes) => api.post(`/payment/admin/payment-requests/${id}/approve`, { admin_notes: adminNotes }),
  rejectPaymentRequest: (id, adminNotes) => api.post(`/payment/admin/payment-requests/${id}/reject`, { admin_notes: adminNotes }),
  manualUpgrade: (studentId, planName) => api.patch('/payment/admin/manual-upgrade', { student_id: studentId, plan_name: planName }),
};

export const rbacService = {
  getMyPlanAccess: () => api.get('/rbac/my-plan-access'),
  getMyPermissions: () => api.get('/rbac/my-permissions'),
  getStudentPermissions: () => api.get('/rbac/permissions'),
  updateStudentPermission: (studentId, permissions) => api.put(`/rbac/permissions/${studentId}`, permissions),
};

export default api;
