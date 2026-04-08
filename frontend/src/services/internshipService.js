import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE = `${API_BASE}/api/internships`;

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const internshipService = {
  // Public / admin
  getAll: (params = {}) =>
    axios.get(BASE, { params, headers: getAuthHeader() }),

  getById: (id) =>
    axios.get(`${BASE}/${id}`, { headers: getAuthHeader() }),

  // Admin CRUD
  create: (data) =>
    axios.post(BASE, data, { headers: getAuthHeader() }),

  update: (id, data) =>
    axios.put(`${BASE}/${id}`, data, { headers: getAuthHeader() }),

  delete: (id) =>
    axios.delete(`${BASE}/${id}`, { headers: getAuthHeader() }),

  togglePublish: (id) =>
    axios.put(`${BASE}/${id}/publish`, {}, { headers: getAuthHeader() }),

  // Admin: view registrations for an internship
  getRegistrations: (id) =>
    axios.get(`${BASE}/${id}/registrations`, { headers: getAuthHeader() }),

  // Admin: update a registration (mark completed, add cert URL)
  updateRegistration: (internshipId, regId, data) =>
    axios.put(`${BASE}/${internshipId}/registrations/${regId}`, data, { headers: getAuthHeader() }),

  // Student: register
  register: (id) =>
    axios.post(`${BASE}/${id}/register`, {}, { headers: getAuthHeader() }),

  // Student: my internships
  getMyInternships: () =>
    axios.get(`${BASE}/student/my`, { headers: getAuthHeader() }),

  // Student: get my submission for one internship
  getMySubmissionForInternship: (internshipId) =>
    axios.get(`${BASE}/student/submissions/${internshipId}`, { headers: getAuthHeader() }),

  // Student: update (re-submit) a submission
  updateSubmission: (submissionId, data) =>
    axios.put(`${BASE}/submissions/${submissionId}`, data, { headers: getAuthHeader() }),

  // Student: all my submissions
  getMySubmissions: () =>
    axios.get(`${BASE}/student/submissions`, { headers: getAuthHeader() }),

  // Admin: Submissions
  getAllSubmissions: (params = {}) =>
    axios.get(`${BASE}/admin/submissions/all`, { params, headers: getAuthHeader() }),

  approveSubmission: (id, data) =>
    axios.post(`${BASE}/admin/submissions/${id}/approve`, data, { headers: getAuthHeader() }),

  rejectSubmission: (id, data) =>
    axios.post(`${BASE}/admin/submissions/${id}/reject`, data, { headers: getAuthHeader() }),
};

export default internshipService;
