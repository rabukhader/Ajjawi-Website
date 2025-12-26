import { memo } from 'react';
import Image from 'next/image';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  brandName: string;
  categoryName?: string;
  t: (key: string) => string;
  showBrand?: boolean; // Optional: hide brand name if already on brand page
}

const ProductCard = memo(({ product, brandName, categoryName, t, showBrand = true }: ProductCardProps) => {
  return (
    <div className="bg-theme-card rounded-lg shadow-theme overflow-hidden hover:shadow-theme-lg transition-all duration-200 hover:-translate-y-1 h-full flex flex-col">
      <div className="relative h-64 overflow-hidden flex-shrink-0">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-theme-primary">{product.name}</h3>
        </div>
        <div className="flex-grow">
          {showBrand && (
            <h4 className="text-sm text-theme-secondary">
              {t('brand')}: {brandName}
            </h4>
          )}
          {categoryName && (
            <h6 className="text-sm text-theme-secondary">
              {t('products.category')}: {categoryName}
            </h6>
          )}
          {product.type && product.type.trim() !== '' && (
            <p className="text-sm text-theme-secondary mb-2">
              {t('products.type')}: {product.type}
            </p>
          )}
        </div>
        {product.price && (
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-primary-600">{product.price}</span>
          </div>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

