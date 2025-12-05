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
}

export interface ApiBrand {
  id: number;
  name: string;
  products: ApiProduct[];
}

// API Response is a list of ApiBrand objects
export type BrandsApiResponse = ApiBrand[];

