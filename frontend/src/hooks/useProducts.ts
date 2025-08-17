import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductsResponse } from '../types';
import { productService } from '../services/api';

interface UseProductsOptions {
  initialLimit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { initialLimit = 30 } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async (page: number, pageLimit: number) => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * pageLimit;
      const response: ProductsResponse = await productService.getProducts(pageLimit, skip);
      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, limit);
  }, [currentPage, limit, fetchProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when limit changes
  };

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    limit,
    total,
    handlePageChange,
    handleLimitChange,
    refetch: () => fetchProducts(currentPage, limit),
  };
};
