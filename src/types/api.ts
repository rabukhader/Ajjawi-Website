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

export type BrandsResponse = ApiResponse<Brand[]>;
export type BrandResponse = ApiResponse<Brand>;
export type ProductsResponse = ApiResponse<Product[]>;
export type ProductResponse = ApiResponse<Product>;

