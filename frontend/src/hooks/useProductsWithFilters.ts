import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product, ProductFilters } from '../types';
import { productService } from '../services/api';
import type { FilterState } from '../components/ProductFilters';

interface UseProductsWithFiltersOptions {
  limit?: number;
}

export const useProductsWithFilters = (options: UseProductsWithFiltersOptions = {}) => {
  const { limit: initialLimit = 12 } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    sortBy: 'title',
    sortOrder: 'asc',
    priceMin: '',
    priceMax: '',
  });

  const apiFilters = useMemo((): ProductFilters => {
    const result: ProductFilters = {};
    
    if (filters.search.trim()) {
      result.search = filters.search.trim();
    }
    
    if (filters.category) {
      result.category = filters.category;
    }
    
    if (filters.sortBy) {
      result.sortBy = filters.sortBy;
    }
    
    if (filters.sortOrder) {
      result.sortOrder = filters.sortOrder;
    }
    
    const priceMin = filters.priceMin !== '' && typeof filters.priceMin === 'number' ? filters.priceMin : null;
    const priceMax = filters.priceMax !== '' && typeof filters.priceMax === 'number' ? filters.priceMax : null;
    
    // Only add price filters if they are valid (min <= max)
    if (priceMin !== null && priceMax !== null) {
      if (priceMin <= priceMax) {
        result.priceMin = priceMin;
        result.priceMax = priceMax;
      }
    } else {
      if (priceMin !== null) {
        result.priceMin = priceMin;
      }
      if (priceMax !== null) {
        result.priceMax = priceMax;
      }
    }
    
    return result;
  }, [filters]);

  const fetchProducts = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * limit;
      
      const response = await productService.getProducts(limit, skip, apiFilters);
      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [limit, apiFilters]);

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    }
  }, []);

  // Fetch products when page or filters change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    categories,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    filters,
    limit,
    handlePageChange,
    handleFiltersChange,
    handleLimitChange,
    refetch: () => fetchProducts(currentPage),
  };
};
