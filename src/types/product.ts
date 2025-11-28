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

