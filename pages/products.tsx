import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  const [gridColumns, setGridColumns] = useState(3); // Default to 3 columns
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setShowScrollTop(scrollY > 400); // Show button after 400px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6 bg-theme-card rounded-lg shadow-theme p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-theme-secondary">{t('products.view') || 'View'}:</span>
                
                {/* Grid Column Control */}
                <div className="flex items-center gap-2 bg-theme-secondary rounded-lg p-1">
                  {[1, 2, 3, 4].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => {
                        setGridColumns(cols);
                        // Switch to grid view if currently in list mode
                        if (viewMode === 'list') {
                          setViewMode('grid');
                        }
                      }}
                      className={`p-2 rounded transition-all ${
                        gridColumns === cols
                          ? 'bg-primary-600 text-white shadow-lg scale-110'
                          : 'text-theme-secondary hover:text-primary-600 hover:bg-theme-tertiary'
                      }`}
                      aria-label={`${cols} columns`}
                      title={`${cols} columns`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        {cols === 1 && (
                          <path d="M2 4a1 1 0 011-1h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                        )}
                        {cols === 2 && (
                          <>
                            <path d="M2 4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                            <path d="M11 4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1h-6a1 1 0 01-1-1V4z" />
                          </>
                        )}
                        {cols === 3 && (
                          <>
                            <path d="M2 4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                            <path d="M8 4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4z" />
                            <path d="M14 4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1h-4a1 1 0 01-1-1V4z" />
                          </>
                        )}
                        {cols === 4 && (
                          <>
                            <path d="M2 4a1 1 0 011-1h3a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                            <path d="M7 4a1 1 0 011-1h3a1 1 0 011 1v12a1 1 0 01-1 1H8a1 1 0 01-1-1V4z" />
                            <path d="M12 4a1 1 0 011-1h3a1 1 0 011 1v12a1 1 0 01-1 1h-3a1 1 0 01-1-1V4z" />
                            <path d="M17 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </>
                        )}
                      </svg>
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-theme-secondary rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'text-theme-secondary hover:text-primary-600'
                    }`}
                    aria-label="Grid view"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'text-theme-secondary hover:text-primary-600'
                    }`}
                    aria-label="List view"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Results Count with Animation */}
              <motion.div
                key={filteredProducts.length}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm text-theme-secondary"
              >
                <span className="font-semibold text-primary-600">{filteredProducts.length}</span>{' '}
                {filteredProducts.length === 1 ? t('products.filters.product') || 'product' : t('products.filters.products') || 'products'}
              </motion.div>
            </div>

            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-theme-card rounded-lg shadow-theme p-12 text-center"
              >
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-theme-secondary text-lg mb-4">{t('products.noResults')}</p>
                {productsData.length > 0 && (selectedBrands.length > 0 || selectedCategories.length > 0 || searchQuery.trim() !== '') && (
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                      setSearchQuery('');
                    }}
                    className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    {t('products.noResults.clear')}
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={`${gridColumns}-${viewMode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid'
                    ? `grid gap-6 ${
                        gridColumns === 1
                          ? 'grid-cols-1'
                          : gridColumns === 2
                          ? 'grid-cols-1 md:grid-cols-2'
                          : gridColumns === 3
                          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                      }`
                    : 'space-y-4'
                }
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.03 }}
                      className={viewMode === 'list' ? 'bg-theme-card rounded-lg shadow-theme p-6' : ''}
                    >
                      {viewMode === 'list' ? (
                        <div className="flex gap-6">
                          <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
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
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-theme-primary mb-2">{product.name}</h3>
                              <p className="text-sm text-theme-secondary mb-2">
                                {t('brand')}: {brandMap.get(product.brandId) || ''}
                              </p>
                              {product.categoryId !== undefined && categoryMap.get(product.categoryId) && (
                                <p className="text-sm text-theme-secondary mb-2">
                                  {t('products.category')}: {categoryMap.get(product.categoryId)}
                                </p>
                              )}
                              {product.type && product.type.trim() !== '' && (
                                <p className="text-sm text-theme-secondary mb-2">
                                  {t('products.type')}: {product.type}
                                </p>
                              )}
                            </div>
                            {product.price && (
                              <div className="mt-4">
                                <span className="text-2xl font-bold text-primary-600">{product.price}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <ProductCard
                          product={product}
                          brandName={brandMap.get(product.brandId) || ''}
                          categoryName={product.categoryId !== undefined ? categoryMap.get(product.categoryId) : undefined}
                          t={t}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 bg-primary-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors group"
            aria-label="Scroll to top"
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </motion.svg>
            <span className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {t('products.scrollTop') || 'Back to top'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick Filter Chips */}
      {(selectedBrands.length > 0 || selectedCategories.length > 0 || searchQuery.trim() !== '') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-4 right-4 md:bottom-8 md:left-8 md:right-auto z-40 flex flex-wrap gap-2 max-w-md"
        >
          {searchQuery.trim() !== '' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg"
            >
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:bg-primary-700 rounded-full p-1 transition-colors"
                aria-label="Remove search"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          )}
          {selectedBrands.map((brandId) => {
            const brand = brandsData.find(b => b.id === brandId);
            return brand ? (
              <motion.div
                key={brandId}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-accent-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg"
              >
                <span>{brand.name}</span>
                <button
                  onClick={() => handleBrandToggle(brandId)}
                  className="hover:bg-accent-700 rounded-full p-1 transition-colors"
                  aria-label={`Remove ${brand.name} filter`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            ) : null;
          })}
          {selectedCategories.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            return category ? (
              <motion.div
                key={categoryId}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-accent-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg"
              >
                <span>{category.name}</span>
                <button
                  onClick={() => handleCategoryToggle(categoryId)}
                  className="hover:bg-accent-700 rounded-full p-1 transition-colors"
                  aria-label={`Remove ${category.name} filter`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            ) : null;
          })}
        </motion.div>
      )}
    </div>
  );
}

