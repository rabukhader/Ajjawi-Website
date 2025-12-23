import type { CategoriesApiResponse } from '../types/api-response';
import { API_ENDPOINTS } from '../config/api';
import { apiService } from '../services/api.service';

export interface ICategoryRepository {
  getAll(): Promise<CategoriesApiResponse>;
}

class CategoryRepository implements ICategoryRepository {
  async getAll(): Promise<CategoriesApiResponse> {
    try {
      const categories = await apiService.get<CategoriesApiResponse>(API_ENDPOINTS.CATEGORIES.LIST);
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export const categoryRepository = new CategoryRepository();

