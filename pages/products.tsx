import { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useProducts } from '../src/hooks/useProducts';
import { useBrands } from '../src/hooks/useBrands';
import { useCategories } from '../src/hooks/useCategories';
import type { Product } from '../src/types/product';

interface ProductCardProps {
  product: Product;
  brandName: string;
  categoryName?: string;
  t: (key: string) => string;
}

const ProductCard = memo(({ product, brandName, categoryName, t }: ProductCardProps) => {
  return (
    <div className="bg-theme-card rounded-lg shadow-theme overflow-hidden hover:shadow-theme-lg transition-all duration-200 hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-theme-primary">{product.name}</h3>
        </div>
        <h4 className="text-sm text-theme-secondary">
        {t('brand')}: {brandName}
          </h4>
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
        {product.price && (
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">{product.price}</span>
          </div>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function Products() {
  const { t } = useLanguage();
  const { products: productsData, loading: productsLoading, error: productsError } = useProducts();
  const { brands: brandsData, loading: brandsLoading, error: brandsError } = useBrands();
  const { categories: categoriesData, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const brandMap = useMemo(() => {
    const map = new Map<string, string>();
    brandsData.forEach((brand) => {
      map.set(brand.id, brand.name);
    });
    return map;
  }, [brandsData]);

  // Create a map of categoryId to category name from the categories API
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categoriesData.forEach((category) => {
      map.set(parseInt(category.id), category.name);
    });
    return map;
  }, [categoriesData]);

  // Convert categories to array format for the filter, sorted by name
  const categories = useMemo(() => {
    return categoriesData
      .map((category) => ({ id: parseInt(category.id), name: category.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesData]);

  const filteredProducts = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const hasSearchQuery = trimmedQuery !== '';
    const hasBrandFilter = selectedBrands.length > 0;
    const hasCategoryFilter = selectedCategories.length > 0;
    const selectedBrandsSet = hasBrandFilter ? new Set(selectedBrands) : null;
    const selectedCategoriesSet = hasCategoryFilter ? new Set(selectedCategories) : null;

    const filtered = productsData.filter((product) => {
      // Brand filter
      const matchesBrand = !hasBrandFilter || (selectedBrandsSet?.has(product.brandId) ?? false);
      if (!matchesBrand) return false;

      // Category filter
      const matchesCategory = !hasCategoryFilter || 
        (product.categoryId !== undefined && selectedCategoriesSet?.has(product.categoryId));
      if (!matchesCategory) return false;

      // Search query filter
      if (!hasSearchQuery) return true;

      const productName = product.name.toLowerCase();
      const productDescription = (product.description || '').toLowerCase();
      
      return productName.includes(trimmedQuery) || productDescription.includes(trimmedQuery);
    });

    // Sort by productOrder if available, then by name
    return filtered.sort((a, b) => {
      if (a.productOrder !== undefined && b.productOrder !== undefined) {
        return a.productOrder - b.productOrder;
      }
      if (a.productOrder !== undefined) return -1;
      if (b.productOrder !== undefined) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [selectedBrands, selectedCategories, searchQuery, productsData]);

  const handleBrandToggle = useCallback((brandId: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter((id) => id !== brandId);
      }
      return [...prev, brandId];
    });
  }, []);

  const handleCategoryToggle = useCallback((categoryId: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  }, []);

  if (productsLoading || brandsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen py-20 bg-theme-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-theme-secondary">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (productsError || brandsError || categoriesError) {
    return (
      <div className="min-h-screen py-20 bg-theme-secondary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-lg">{t('common.error')}</p>
          <p className="text-theme-secondary">
            {productsError?.message || brandsError?.message || categoriesError?.message || 'Failed to load data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-theme-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-theme-primary">{t('products.title')}</h1>
          <p className="text-lg text-theme-secondary">
            {t('products.subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="bg-theme-card rounded-lg shadow-theme p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-theme-primary">{t('products.filters.title')}</h2>

              {/* Search */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2 text-theme-secondary">
                  {t('products.filters.search')}
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('products.filters.search')}
                  className="w-full px-4 py-2 border border-theme rounded-lg bg-theme-primary text-theme-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  style={{ borderColor: 'var(--border-primary)' }}
                />
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-4 text-theme-secondary">
                    {t('products.filters.category')}
                  </label>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center cursor-pointer hover:text-primary-600 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <span className="ml-3 rtl:mr-3 rtl:ml-0 text-theme-secondary">{category.name}</span>
                      </label>
                    ))}
                  </div>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      {t('products.filters.clearCategories')}
                    </button>
                  )}
                </div>
              )}

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-semibold mb-4 text-theme-secondary">
                  {t('products.filters.brand')}
                </label>
                <div className="space-y-3">
                  {brandsData.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center cursor-pointer hover:text-primary-600 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => handleBrandToggle(brand.id)}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <span className="ml-3 rtl:mr-3 rtl:ml-0 text-theme-secondary">{brand.name}</span>
                    </label>
                  ))}
                </div>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setSelectedBrands([])}
                    className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    {t('products.filters.clearBrands')}
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <p className="text-sm text-theme-secondary">
                  {t('products.filters.results')} <span className="font-semibold">{filteredProducts.length}</span> {t('products.filters.of')}{' '}
                  <span className="font-semibold">{productsData.length}</span> {t('products.filters.products')}
                </p>
              </div>
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-theme-card rounded-lg shadow-theme p-12 text-center">
                <p className="text-theme-secondary text-lg">{t('products.noResults')}</p>
                {productsData.length > 0 && (selectedBrands.length > 0 || selectedCategories.length > 0 || searchQuery.trim() !== '') && (
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                      setSearchQuery('');
                    }}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    {t('products.noResults.clear')}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    brandName={brandMap.get(product.brandId) || ''}
                    categoryName={product.categoryId !== undefined ? categoryMap.get(product.categoryId) : undefined}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

