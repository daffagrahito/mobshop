export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// New standardized response types
export interface SuccessResponse<T = any> {
  message: string;
  data?: T;
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  sortBy?: 'title' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
  priceMin?: number;
  priceMax?: number;
}
