import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useProducts } from '../src/hooks/useProducts';
import { useBrands } from '../src/hooks/useBrands';
import { useCategories } from '../src/hooks/useCategories';
import ProductCard from '../src/components/ProductCard';
import { getBrandName } from '../src/utils/brand.utils';

// Hook to detect screen size breakpoints
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'md' | 'lg'>('mobile');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setScreenSize('lg');
      } else if (width >= 768) {
        setScreenSize('md');
      } else {
        setScreenSize('mobile');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
};

export default function Products() {
  const { t, language } = useLanguage();
  const { products: productsData, loading: productsLoading, error: productsError } = useProducts();
  const { brands: brandsData, loading: brandsLoading, error: brandsError } = useBrands();
  const { categories: categoriesData, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const screenSize = useScreenSize();

  // Get available column options based on screen size
  const availableColumns = useMemo(() => {
    if (screenSize === 'lg') {
      return [1, 2, 3, 4]; // All columns available on large screens
    } else if (screenSize === 'md') {
      return [1, 2]; // Only 1-2 columns on medium screens
    } else {
      return [1]; // Only 1 column on mobile
    }
  }, [screenSize]);

  // Set default grid columns - always start with 4 columns
  const [gridColumns, setGridColumns] = useState(4);

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
      map.set(brand.id, getBrandName(brand, language));
    });
    return map;
  }, [brandsData, language]);

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

  // Separate new products and regular products, filter out hidden products
  const { newProducts, regularProducts } = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const hasSearchQuery = trimmedQuery !== '';
    const hasBrandFilter = selectedBrands.length > 0;
    const hasCategoryFilter = selectedCategories.length > 0;
    const selectedBrandsSet = hasBrandFilter ? new Set(selectedBrands) : null;
    const selectedCategoriesSet = hasCategoryFilter ? new Set(selectedCategories) : null;

    const filterProduct = (product: typeof productsData[0]) => {
      // Filter out hidden products
      if (product.isHidden === true) return false;

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
    };

    const sortProducts = (products: typeof productsData) => {
      return products.sort((a, b) => {
        if (a.productOrder !== undefined && b.productOrder !== undefined) {
          return a.productOrder - b.productOrder;
        }
        if (a.productOrder !== undefined) return -1;
        if (b.productOrder !== undefined) return 1;
        return a.name.localeCompare(b.name);
      });
    };

    const filtered = productsData.filter(filterProduct);
    const newProductsList = filtered.filter(p => p.isNew === true);
    const regularProductsList = filtered.filter(p => p.isNew !== true);

    return {
      newProducts: sortProducts(newProductsList),
      regularProducts: sortProducts(regularProductsList),
    };
  }, [selectedBrands, selectedCategories, searchQuery, productsData]);

  // Combined filtered products for count display (excluding new products from regular count)
  const filteredProducts = useMemo(() => {
    return [...regularProducts];
  }, [regularProducts]);


  
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

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
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
    <div className="py-20 bg-theme-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-theme-primary">{t('products.title')}</h1>
          <p className="text-lg text-theme-secondary">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
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
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                      onClick={() => {
                        setSelectedCategories([]);
                      }}
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
                      <span className="ml-3 rtl:mr-3 rtl:ml-0 text-theme-secondary">{getBrandName(brand, language)}</span>
                    </label>
                  ))}
                </div>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                    }}
                    className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    {t('products.filters.clearBrands')}
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <p className="text-sm text-theme-secondary">
                  {t('products.filters.results')} <span className="font-semibold">{filteredProducts.length + newProducts.length}</span> {t('products.filters.of')}{' '}
                  <span className="font-semibold">{productsData.filter(p => p.isHidden !== true).length}</span> {t('products.filters.products')}
                </p>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6 bg-theme-card rounded-lg shadow-theme p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-theme-secondary">{t('products.view') || 'View'}:</span>
                
                {/* Grid Column Control - Only show when multiple options are available */}
                {availableColumns.length > 1 && (
                  <div className="flex items-center gap-2 bg-theme-secondary rounded-lg p-1">
                    {availableColumns.map((cols) => (
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
                              <rect x="1" y="3" width="4.5" height="14" rx="0.5" fill="currentColor" />
                              <rect x="6.5" y="3" width="4.5" height="14" rx="0.5" fill="currentColor" />
                              <rect x="12" y="3" width="4.5" height="14" rx="0.5" fill="currentColor" />
                            </>
                          )}
                          {cols === 4 && (
                            <>
                              <rect x="0.5" y="3" width="3.5" height="14" rx="0.5" fill="currentColor" />
                              <rect x="4.75" y="3" width="3.5" height="14" rx="0.5" fill="currentColor" />
                              <rect x="9" y="3" width="3.5" height="14" rx="0.5" fill="currentColor" />
                              <rect x="13.25" y="3" width="3.5" height="14" rx="0.5" fill="currentColor" />
                            </>
                          )}
                        </svg>
                      </button>
                    ))}
                  </div>
                )}

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

              {/* Results Count */}
              <div className="text-sm text-theme-secondary">
                <span className="font-semibold text-primary-600">{filteredProducts.length + newProducts.length}</span>{' '}
                {(filteredProducts.length + newProducts.length) === 1 ? t('products.filters.product') || 'product' : t('products.filters.products') || 'products'}
              </div>
            </div>

            {/* New Products Section */}
            {newProducts.length > 0 && (
              <div className="mb-12">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 md:p-4 shadow-xl mb-4">
                  <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl md:text-3xl animate-bounce">✨</span>
                        <h2 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                          {t('products.newProducts.title') || 'New Products!'}
                        </h2>
                        <span className="text-2xl md:text-3xl animate-bounce">✨</span>
                      </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
                </div>

                <div
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
                  {newProducts.map((product) => (
                    <div
                      key={product.id}
                      className={viewMode === 'list' ? 'bg-theme-card rounded-lg shadow-theme p-6' : 'h-full'}
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
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-theme-primary">{product.name}</h3>
                                <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">NEW</span>
                              </div>
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
                        <div className="relative h-full">
                          <ProductCard
                            product={product}
                            brandName={brandMap.get(product.brandId) || ''}
                            categoryName={product.categoryId !== undefined ? categoryMap.get(product.categoryId) : undefined}
                            t={t}
                          />
                          <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                            NEW
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Products Section */}
            {filteredProducts.length === 0 && newProducts.length === 0 ? (
              <div className="bg-theme-card rounded-lg shadow-theme p-12 text-center">
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
              </div>
            ) : filteredProducts.length > 0 ? (
              <div>
                {newProducts.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-theme-primary mb-4">{t('products.allProducts') || 'All Products'}</h2>
                  </div>
                )}
                <div
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
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={viewMode === 'list' ? 'bg-theme-card rounded-lg shadow-theme p-6' : 'h-full'}
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
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 bg-primary-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors group"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          <span className="absolute -top-12 right-0 rtl:right-auto rtl:left-0 bg-gray-900 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {t('products.scrollTop') || 'Back to top'}
          </span>
        </button>
      )}

      {/* Quick Filter Chips */}
      {(selectedBrands.length > 0 || selectedCategories.length > 0 || searchQuery.trim() !== '') && (
        <div className="fixed bottom-20 left-4 right-4 md:bottom-8 md:left-8 md:right-auto z-40 flex flex-wrap gap-2 max-w-md">
          {searchQuery.trim() !== '' && (
            <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                }}
                className="hover:bg-primary-700 rounded-full p-1 transition-colors"
                aria-label="Remove search"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          {selectedBrands.map((brandId) => {
            const brand = brandsData.find(b => b.id === brandId);
            return brand ? (
              <div
                key={brandId}
                className="bg-accent-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg"
              >
                <span>{getBrandName(brand, language)}</span>
                <button
                  onClick={() => handleBrandToggle(brandId)}
                  className="hover:bg-accent-700 rounded-full p-1 transition-colors"
                  aria-label={`Remove ${getBrandName(brand, language)} filter`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : null;
          })}
          {selectedCategories.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            return category ? (
              <div
                key={categoryId}
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
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

