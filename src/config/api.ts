// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.raymaizing.com/api',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://api.raymaizing.com',
  TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // User Management
  USER: {
    PROFILE: '/user/profile',
    USAGE: '/user/usage',
    PROCESS_FILES: '/user/process-files',
    REFERRALS: '/user/referrals',
    DEACTIVATE: '/user/deactivate',
    DELETE_ACCOUNT: '/user/account',
  },
  
  // Subscriptions
  SUBSCRIPTION: {
    PLANS: '/subscription/plans',
    CURRENT: '/subscription/current',
    SUBSCRIBE: '/subscription/subscribe',
    CONFIRM_PAYMENT: '/subscription/confirm-payment',
    CANCEL: '/subscription/cancel',
    UPGRADE: '/subscription/upgrade',
    HISTORY: '/subscription/history',
  },
  
  // Social Auth
  SOCIAL: {
    GOOGLE: '/auth/google',
    APPLE: '/auth/apple',
    GITHUB: '/auth/github',
  }
};

// HTTP Headers
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  const authToken = token || localStorage.getItem('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
  retryAfter?: number;
  lockUntil?: string;
}

export interface User {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  role: string;
  email_verified: boolean;
  profile_completed: boolean;
  two_factor_enabled: boolean;
  referral_code: string;
  subscription_status: string;
  files_processed_this_month: number;
  monthly_limit: number;
  created_at: string;
  displayName?: string;
  fullName?: string;
  remainingFiles?: number;
}

export interface AuthData {
  user: User;
  token: string;
  verificationRequired?: boolean;
}

// API Helper Functions
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };
  
  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
};

export const apiGet = <T = any>(endpoint: string) => 
  apiRequest<T>(endpoint, { method: 'GET' });

export const apiPost = <T = any>(endpoint: string, data?: any) =>
  apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiPut = <T = any>(endpoint: string, data?: any) =>
  apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiDelete = <T = any>(endpoint: string) =>
  apiRequest<T>(endpoint, { method: 'DELETE' });