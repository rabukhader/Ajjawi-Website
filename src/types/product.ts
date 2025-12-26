export const ProductType = {
  CARTON: 'كرتونة',
  DOZEN: 'دزينة',
  CAN: 'علبة',
  TANK: 'تنكة',
  PACKET: 'بكيت',
  KILOGRAM: 'كغم',
  GALLON: 'غلن',
  KILO: 'كيلو',
  SACK: 'شوال',
  BAG: 'كيس',
  BUCKET: 'سطل',
  BUNDLE: 'ربطة',
  UNKNOWN: '',
} as const;

export type ProductType = typeof ProductType[keyof typeof ProductType];

// Category enum - can be extended based on backend categories
export const Category = {
  OTHERS: 0,
  // Add more categories as needed based on backend response
} as const;

export type Category = typeof Category[keyof typeof Category];

export interface Product {
  id: string;
  name: string;
  nameAr?: string; // Arabic name if different
  brandId: string;
  image?: string;
  description?: string;
  descriptionAr?: string; // Arabic description
  price?: string;
  type: ProductType; // ProductType from the const above (includes empty string as UNKNOWN)
  categoryId?: number; // Category ID from backend
  categoryName?: string; // Category name from backend
  productOrder?: number; // Product order for sorting
  isNew?: boolean; // Indicates if product is new
  isHidden?: boolean; // Indicates if product should be hidden
}

export interface Brand {
  id: string;
  name: string;
  nameAr?: string; // Arabic name if different
  logo: string;
  description: string;
  descriptionAr?: string; // Arabic description
  products?: Product[]; // Products can be nested in brand
}

