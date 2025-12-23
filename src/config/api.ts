// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Brands endpoints
  BRANDS: {
    LIST: '/api/brands', // GET /api/brands - Get all brands
    DETAIL: '/api/brands/:id', // GET /api/brands/:id - Get brand by ID
    CREATE: '/api/brands', // POST /api/brands - Create brand
    UPDATE: '/api/brands/:id', // PUT /api/brands/:id - Update brand
    DELETE: '/api/brands/:id', // DELETE /api/brands/:id - Delete brand
  },
  
  // Products endpoints
  PRODUCTS: {
    LIST: '/api/products', // GET /api/products - Get all products (returns same structure as brands)
    BY_BRAND: '/api/products', // GET /api/products?brandId=:id - Get products by brand
    DETAIL: '/api/products/:id', // GET /api/products/:id - Get product by ID
    CREATE: '/api/products', // POST /api/products - Create product
    UPDATE: '/api/products/:id', // PUT /api/products/:id - Update product
    DELETE: '/api/products/:id', // DELETE /api/products/:id - Delete product
  },
  
  // Categories endpoints
  CATEGORIES: {
    LIST: '/api/categories', // GET /api/categories - Get all categories
  },
  
  // Contact endpoints
  CONTACT: {
    SUBMIT: '/api/contact', // POST /api/contact - Submit contact form
  },
} as const;

// API Base URL - Backend endpoint
// In Next.js, use NEXT_PUBLIC_ prefix for client-side environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://3.239.1.159:8089';

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  } as Record<string, string>,
};

