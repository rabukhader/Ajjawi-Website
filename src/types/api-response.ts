// API Response Types - Matching Backend Structure

export interface ApiProduct {
  id: number;
  brandId: number;
  brandName: string;
  name: string;
  quantity: string;
  packaging: string;
  unit: string;
  categoryId: number;
  categoryName: string;
  productOrder: number;
  isNew?: boolean;
  isHidden?: boolean;
}

export interface ApiBrand {
  id: number;
  name: string;
  nameEnglish?: string;
  imageUrl: string;
  // Products are no longer returned in the brands API response
  // They must be fetched separately from the products API
}

// API Response is a list of ApiBrand objects
export type BrandsApiResponse = ApiBrand[];

// Category API Response
export interface ApiCategory {
  id: number;
  name: string;
}

// API Response is a list of ApiCategory objects
export type CategoriesApiResponse = ApiCategory[];

