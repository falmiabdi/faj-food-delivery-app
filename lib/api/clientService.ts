import { apiClient } from './client';
import { Product } from './types';

const API_ENDPOINTS = {
  products: '/products',
};

export const clientService = {
  async getAllProducts(): Promise<Product[]> {
    const requestId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    
    console.log(`🔍 [${requestId}] ClientService: Fetching all products started`, {
      timestamp: new Date().toISOString(),
      endpoint: API_ENDPOINTS.products
    });
    
    try {
      console.log(`📤 [${requestId}] Making API request to: ${API_ENDPOINTS.products}`);
      
      const products = await apiClient.get<Product[]>(API_ENDPOINTS.products);
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ [${requestId}] ClientService: Products fetched successfully`, {
        count: products?.length || 0,
        duration: `${duration}ms`,
        firstProduct: products && products.length > 0 ? {
          id: products[0].id,
          title: products[0].title?.substring(0, 30),
          price: products[0].price
        } : 'none'
      });
      
      // Log sample of products
      if (products && products.length > 0) {
        console.log(`📦 [${requestId}] Sample products (first 2):`, 
          products.slice(0, 2).map(p => ({
            id: p.id,
            title: p.title?.substring(0, 20),
            price: p.price,
            category: p.category
          }))
        );
      } else {
        console.warn(`⚠️ [${requestId}] No products returned from API`);
      }
      
      return products;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.error(`❌ [${requestId}] ClientService: Error fetching products`, {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      });
      
      // Additional debug info
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          console.log(`🌐 [${requestId}] Network error - check internet connection`);
        } else if (error.message.includes('timeout')) {
          console.log(`⏱️ [${requestId}] Request timeout - API might be slow`);
        } else if (error.message.includes('404')) {
          console.log(`🔍 [${requestId}] 404 error - endpoint not found: ${API_ENDPOINTS.products}`);
        }
      }
      
      throw error;
    }
  },
};

// Auto-test in development
if (__DEV__) {
  setTimeout(() => {
    console.log('🧪 Testing clientService connection...');
    clientService.getAllProducts()
      .then(products => {
        console.log(`✅ ClientService test successful: ${products.length} products available`);
      })
      .catch(error => {
        console.warn('⚠️ ClientService test failed:', error?.message);
      });
  }, 1000);
}