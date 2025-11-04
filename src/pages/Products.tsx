import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import productsData from '../../data/products.json';
import brandsData from '../../data/brands.json';

const Products = () => {
  const { t } = useLanguage();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brandId);
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });
  }, [selectedBrands, searchQuery]);

  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
  };

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
                    {t('products.filters.clear')}
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
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSearchQuery('');
                  }}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  {t('products.noResults.clear')}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-theme-card rounded-lg shadow-theme overflow-hidden hover:shadow-theme-lg transition-shadow"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-theme-primary">{product.name}</h3>
                        <span className="text-sm text-theme-secondary">
                          {brandsData.find((b) => b.id === product.brandId)?.name}
                        </span>
                      </div>
                      <p className="text-theme-secondary mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600">{product.price}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
