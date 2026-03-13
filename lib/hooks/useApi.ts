import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../api/client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  autoFetch?: boolean;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = { autoFetch: true }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.autoFetch);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (error) {
      const apiError = error instanceof ApiError 
        ? error 
        : new ApiError(0, 'Unknown error occurred');
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (options.autoFetch) {
      execute();
    }
  }, [execute, options.autoFetch]);

  return { data, loading, error, execute };
}

// Simple hooks
export function useAllProducts() {
  const { clientService } = require('../api/clientService');
  return useApi(() => clientService.getAllProducts());
}