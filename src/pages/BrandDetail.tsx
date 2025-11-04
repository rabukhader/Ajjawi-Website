import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import brandsData from '../../data/brands.json';
import productsData from '../../data/products.json';

const BrandDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const brand = brandsData.find((b) => b.id === id);
  const brandProducts = productsData.filter((p) => p.brandId === id);

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-primary">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-theme-primary">{t('brand.detail.notFound')}</h1>
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
          <h2 className="text-3xl font-bold mb-8 text-theme-primary">{t('brand.detail.products')}</h2>
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
                    <p className="text-theme-secondary mb-4 line-clamp-3">{product.description}</p>
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
  );
};

export default BrandDetail;
