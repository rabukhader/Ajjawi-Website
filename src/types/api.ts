import type { Brand, Product } from './product';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BrandsResponse extends ApiResponse<Brand[]> {}
export interface BrandResponse extends ApiResponse<Brand> {}
export interface ProductsResponse extends ApiResponse<Product[]> {}
export interface ProductResponse extends ApiResponse<Product> {}

