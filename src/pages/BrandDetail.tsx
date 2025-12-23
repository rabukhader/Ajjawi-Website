import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import type { Brand } from '../types/product';
import { brandRepository } from '../repositories/brand.repository';
import { useProducts } from '../hooks/useProducts';

const BrandDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch products for this brand
  const { products: allProducts, loading: productsLoading } = useProducts();
  
  // Filter products by brandId
  const brandProducts = allProducts.filter((product) => product.brandId === id);

  useEffect(() => {
    const fetchBrand = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await brandRepository.getById(id);
        setBrand(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch brand'));
        console.error('Error fetching brand:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-theme-secondary">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-primary">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-theme-primary">{t('brand.detail.notFound')}</h1>
          <p className="text-red-600 mb-4">{error?.message}</p>
          <Link to="/brands" className="text-primary-600 hover:underline">
            {t('brand.detail.back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-theme-secondary">
      <div className="container mx-auto px-4">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-theme-card rounded-xl shadow-theme-lg p-8 mb-12"
        >
          <Link
            to="/brands"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <svg
              className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('brand.detail.back')}
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 md:mb-0 md:mr-8 rtl:md:mr-0 rtl:md:ml-8 flex-shrink-0">
              <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4 text-theme-primary">{brand.name}</h1>
              <p className="text-lg text-theme-secondary leading-relaxed">{brand.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-theme-primary">
            {t('brand.detail.products')} ({brandProducts.length})
          </h2>
          {brandProducts.length === 0 ? (
            <div className="bg-theme-card rounded-lg shadow-theme p-8 text-center">
              <p className="text-theme-secondary">{t('brand.detail.noProducts')}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {brandProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                    <h3 className="text-xl font-semibold mb-2 text-theme-primary">{product.name}</h3>
                    {product.description && (
                      <p className="text-theme-secondary mb-4 line-clamp-3">{product.description}</p>
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
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
