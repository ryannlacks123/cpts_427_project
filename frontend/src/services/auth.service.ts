import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  is2faEnabled: boolean;
}

export interface LoginResponse {
  token?: string;
  user?: User;
  require2FA?: boolean;
  tempToken?: string;
  message?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

/**
 * Verify 2FA code
 */
export const verify2FA = async (tempToken: string, code: string) => {
  const response = await api.post('/auth/2fa/verify', { tempToken, code });
  return response.data;
};

/**
 * Enable 2FA
 */
export const enable2FA = async () => {
  const response = await api.post('/auth/2fa/enable');
  return response.data;
};

/**
 * Confirm 2FA setup
 */
export const confirm2FA = async (code: string) => {
  const response = await api.post('/auth/2fa/confirm', { code });
  return response.data;
};

/**
 * Disable 2FA
 */
export const disable2FA = async (password: string) => {
  const response = await api.post('/auth/2fa/disable', { password });
  return response.data;
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<User> => {
  const response = await api.get('/auth/profile');
  return response.data;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Save auth data to localStorage
 */
export const saveAuthData = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
