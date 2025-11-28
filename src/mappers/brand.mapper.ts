import type { Brand, Product, ProductType } from '../types/product';
import type { ApiBrand, ApiProduct } from '../types/api-response';
import { ProductType as ProductTypeConst } from '../types/product';

// Map API product type (unit/packaging) to our ProductType
function mapProductType(unit: string, packaging: string): ProductType {
  // Map unit and packaging to our ProductType enum values
  const unitMap: Record<string, ProductType> = {
    'كرتونة': ProductTypeConst.CARTON,
    'دزينة': ProductTypeConst.DOZEN,
    'علبة': ProductTypeConst.CAN,
    'تنكة': ProductTypeConst.TANK,
    'بكيت': ProductTypeConst.PACKET,
    'كغم': ProductTypeConst.KILOGRAM,
    'غلن': ProductTypeConst.GALLON,
    'كيلو': ProductTypeConst.KILO,
    'شوال': ProductTypeConst.SACK,
    'كيس': ProductTypeConst.BAG,
    'سطل': ProductTypeConst.BUCKET,
    'ربطة': ProductTypeConst.BUNDLE,
  };

  // Try to match unit first, then packaging
  const normalizedUnit = unit?.trim() || '';
  const normalizedPackaging = packaging?.trim() || '';

  return unitMap[normalizedUnit] || unitMap[normalizedPackaging] || ProductTypeConst.UNKNOWN;
}

// Transform API Product to internal Product type
export function mapApiProductToProduct(apiProduct: ApiProduct, brandId: string): Product {
  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    brandId: brandId || apiProduct.brandId.toString(),
    description: `Quantity: ${apiProduct.quantity}, Packaging: ${apiProduct.packaging}, Unit: ${apiProduct.unit}`,
    type: mapProductType(apiProduct.unit, apiProduct.packaging),
    // Note: image, price not provided by API, will be undefined
  };
}

// Transform API Brand to internal Brand type
export function mapApiBrandToBrand(apiBrand: ApiBrand): Brand {
  const brandId = apiBrand.id.toString();
  
  return {
    id: brandId,
    name: apiBrand.name,
    logo: '', // Not provided by API, will use placeholder or default
    description: '', // Not provided by API
    products: apiBrand.products.map((product) => mapApiProductToProduct(product, brandId)),
  };
}

// Transform API Brands array to internal Brands array
export function mapApiBrandsToBrands(apiBrands: ApiBrand[]): Brand[] {
  return apiBrands.map(mapApiBrandToBrand);
}

