import type { Product } from '../types/product';
import type { ApiProduct, BrandsApiResponse } from '../types/api-response';
import { API_ENDPOINTS } from '../config/api';
import { apiService } from '../services/api.service';
import { mapApiProductToProduct, mapApiBrandsToBrands } from '../mappers/brand.mapper';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product>;
  getByBrandId(brandId: string): Promise<Product[]>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}

class ProductRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    try {
      // API returns BrandsApiResponse (same structure as brands API)
      const apiResponse = await apiService.get<BrandsApiResponse>(API_ENDPOINTS.PRODUCTS.LIST);
      
      // Transform API response to internal Brand type
      const brands = mapApiBrandsToBrands(apiResponse);
      
      // Flatten products from all brands
      const products: Product[] = [];
      brands.forEach((brand) => {
        if (brand.products) {
          products.push(...brand.products);
        }
      });
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Product> {
    try {
      // Fetch all products and find by id
      const products = await this.getAll();
      const product = products.find((p) => p.id === id);
      
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      
      return product;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async getByBrandId(brandId: string): Promise<Product[]> {
    try {
      // Fetch all products and filter by brandId
      const products = await this.getAll();
      return products.filter((p) => p.brandId === brandId);
    } catch (error) {
      console.error(`Error fetching products for brand ${brandId}:`, error);
      throw error;
    }
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    // API response structure may vary, adjust based on actual backend response
    const response = await apiService.post<ApiProduct>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      product
    );
    return mapApiProductToProduct(response, product.brandId);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const endpoint = API_ENDPOINTS.PRODUCTS.UPDATE.replace(':id', id);
    // API response structure may vary, adjust based on actual backend response
    const response = await apiService.put<ApiProduct>(endpoint, product);
    return mapApiProductToProduct(response, product.brandId || '');
  }

  async delete(id: string): Promise<void> {
    const endpoint = API_ENDPOINTS.PRODUCTS.DELETE.replace(':id', id);
    await apiService.delete<void>(endpoint);
  }
}

export const productRepository = new ProductRepository();
