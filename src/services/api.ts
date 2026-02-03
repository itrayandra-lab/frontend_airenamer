import axios from 'axios';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://ai-pengatur-file-api.test/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/login', data),
  
  logout: () =>
    api.post('/logout'),
  
  getUser: () =>
    api.get('/user'),
};

// Subscription API
export const subscriptionAPI = {
  list: () =>
    api.get('/subscriptions'),
  
  create: (data: { package_type: string; file_limit: number; billing_cycle: string }) =>
    api.post('/subscriptions/create', data),
  
  get: (id: number) =>
    api.get(`/subscriptions/${id}`),
  
  cancel: (id: number) =>
    api.post(`/subscriptions/${id}/cancel`),
};

// Usage API
export const usageAPI = {
  current: () =>
    api.get('/usage/current'),
  
  track: (data: { files_count: number; operation_type: string }) =>
    api.post('/usage/track', data),
  
  history: () =>
    api.get('/usage/history'),
  
  processingHistory: () =>
    api.get('/usage/processing-history'),
};

// Admin API
export const adminAPI = {
  dashboard: () =>
    api.get('/admin/dashboard'),
  
  users: (params?: { search?: string; status?: string; page?: number }) =>
    api.get('/admin/users', { params }),
  
  userDetail: (id: number) =>
    api.get(`/admin/users/${id}`),
  
  updateUser: (id: number, data: any) =>
    api.put(`/admin/users/${id}`, data),
  
  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`),
  
  subscriptions: (params?: { status?: string; package_type?: string; page?: number }) =>
    api.get('/admin/subscriptions', { params }),
  
  transactions: (params?: { status?: string; start_date?: string; end_date?: string; page?: number }) =>
    api.get('/admin/transactions', { params }),
  
  analytics: () =>
    api.get('/admin/analytics'),
};

export default api;
