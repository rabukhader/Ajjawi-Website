import type { ApiCategory } from '../types/api-response';

export interface Category {
  id: string;
  name: string;
}

// Transform API Category to internal Category type
export function mapApiCategoryToCategory(apiCategory: ApiCategory): Category {
  return {
    id: apiCategory.id.toString(),
    name: apiCategory.name,
  };
}

// Transform API Categories array to internal Categories array
export function mapApiCategoriesToCategories(apiCategories: ApiCategory[]): Category[] {
  return apiCategories.map(mapApiCategoryToCategory);
}

