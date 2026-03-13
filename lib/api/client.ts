import { Platform } from 'react-native';

// Base API configuration
const API_CONFIG = {
  // Free JSONPlaceholder API for testing
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Error types for better handling
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request interceptor
const requestInterceptor = async (config: RequestInit): Promise<RequestInit> => {
  // Add auth token if available
  // const token = await getToken();
  // if (token) {
  //   config.headers = {
  //     ...config.headers,
  //     'Authorization': `Bearer ${token}`,
  //   };
  // }
  
  console.log('🌐 API Request:', config);
  return config;
};

// Response interceptor
const responseInterceptor = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `HTTP error ${response.status}`,
      errorData
    );
  }
  
  const data = await response.json();
  console.log('✅ API Response:', { status: response.status, data });
  return data;
};

// Main API client
export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    };

    const config = await requestInterceptor({
      ...defaultOptions,
      ...options,
    });

    try {
      const response = await fetch(url, config);
      return await responseInterceptor(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      
      // Network errors
      throw new ApiError(
        0,
        error instanceof Error ? error.message : 'Network error',
        { originalError: error }
      );
    }
  },

  // HTTP method shortcuts
  get<T>(endpoint: string, params?: Record<string, string>) {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params)}`
      : endpoint;
    return this.request<T>(url, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },

  patch<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};