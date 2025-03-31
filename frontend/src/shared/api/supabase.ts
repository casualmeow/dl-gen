import axios from 'axios';

// API client configuration
const API_URL = '/api/v2';

// Create API client
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User types
export type UserResponse = {
  username: string;
  email?: string;
  full_name?: string;
};

// Authentication functions
export const signIn = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Authentication failed');
    }
    throw error;
  }
};

export const signOut = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Logout failed');
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/user');
    return response.data as UserResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to get user data');
    }
    throw error;
  }
};