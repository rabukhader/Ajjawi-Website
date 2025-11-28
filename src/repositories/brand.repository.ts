import type { Brand } from '../types/product';
import type { BrandsApiResponse } from '../types/api-response';
import { API_ENDPOINTS } from '../config/api';
import { apiService } from '../services/api.service';
import { mapApiBrandsToBrands } from '../mappers/brand.mapper';

export interface IBrandRepository {
  getAll(): Promise<Brand[]>;
  getById(id: string): Promise<Brand>;
  create(brand: Omit<Brand, 'id'>): Promise<Brand>;
  update(id: string, brand: Partial<Brand>): Promise<Brand>;
  delete(id: string): Promise<void>;
}

class BrandRepository implements IBrandRepository {
  async getAll(): Promise<Brand[]> {
    try {
      // API returns BrandsApiResponse directly (array of ApiBrand)
      const apiResponse = await apiService.get<BrandsApiResponse>(API_ENDPOINTS.BRANDS.LIST);
      
      // Transform API response to internal Brand type
      const brands = mapApiBrandsToBrands(apiResponse);
      
      return brands;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Brand> {
    try {
      // For now, fetch all brands and filter by id
      // If backend provides a detail endpoint later, use it
      const brands = await this.getAll();
      const brand = brands.find((b) => b.id === id);
      
      if (!brand) {
        throw new Error(`Brand with id ${id} not found`);
      }
      
      return brand;
    } catch (error) {
      console.error(`Error fetching brand ${id}:`, error);
      throw error;
    }
  }

  async create(brand: Omit<Brand, 'id'>): Promise<Brand> {
    // API response structure may vary, adjust based on actual backend response
    const response = await apiService.post<BrandsApiResponse[0]>(
      API_ENDPOINTS.BRANDS.CREATE,
      brand
    );
    return mapApiBrandsToBrands([response])[0];
  }

  async update(id: string, brand: Partial<Brand>): Promise<Brand> {
    const endpoint = API_ENDPOINTS.BRANDS.UPDATE.replace(':id', id);
    // API response structure may vary, adjust based on actual backend response
    const response = await apiService.put<BrandsApiResponse[0]>(endpoint, brand);
    return mapApiBrandsToBrands([response])[0];
  }

  async delete(id: string): Promise<void> {
    const endpoint = API_ENDPOINTS.BRANDS.DELETE.replace(':id', id);
    await apiService.delete<void>(endpoint);
  }
}

export const brandRepository = new BrandRepository();
