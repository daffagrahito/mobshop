import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, User, ProductsResponse, ProductFilters } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/sign-in';
    }
    
    if (error.response?.data?.error) {
      const enhancedError = new Error(error.response.data.error);
      enhancedError.name = error.response.data.code || 'APIError';
      Object.assign(enhancedError, {
        response: error.response,
        code: error.response.data.code,
        details: error.response.data.details,
      });
      return Promise.reject(enhancedError);
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/login', credentials);
    return response.data.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/register', userData);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/profile');
    return response.data.data.user;
  },
};

export const productService = {
  getProducts: async (limit = 12, skip = 0, filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });

    // Add filters to query parameters
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.priceMin !== undefined) params.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax !== undefined) params.append('priceMax', filters.priceMax.toString());

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/categories');
    return response.data.categories;
  },
};

export const checkoutService = {
  checkout: async (): Promise<{ message: string }> => {
    const response = await api.post('/checkout');
    return { message: response.data.message };
  },
};

export default api;
