import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useBrands } from '../src/hooks/useBrands';
import { useProducts } from '../src/hooks/useProducts';
import { useMemo } from 'react';
import { getBrandName } from '../src/utils/brand.utils';

export default function Brands() {
  const { t, language } = useLanguage();
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();
  const { products, loading: productsLoading } = useProducts();

  const productCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      if (product.isHidden !== true) {
        const count = counts.get(product.brandId) || 0;
        counts.set(product.brandId, count + 1);
      }
    });
    return counts;
  }, [products]);

  const visibleBrands = useMemo(() => {
    return brands.filter((brand) => {
      const count = productCounts.get(brand.id) || 0;
      return count > 0;
    });
  }, [brands, productCounts]);

  const loading = brandsLoading || productsLoading;
  const error = brandsError;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 bg-theme-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-theme-secondary">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20 bg-theme-secondary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('common.error')}</p>
          <p className="text-theme-secondary">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{t('nav.brands')} | Ajjawi</title>
        <meta name="description" content={t('brands.subtitle')} />
      </Head>
      <div className="min-h-screen py-20 bg-theme-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-theme-primary">{t('brands.title')}</h1>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            {t('brands.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {visibleBrands.map((brand) => (
            <motion.div
              key={brand.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-theme-card rounded-xl shadow-theme-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link href={brand.id ? `/brands/${brand.id}` : '#'}>
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden mr-6 rtl:mr-0 rtl:ml-6 flex-shrink-0 relative">
                      <Image
                        src={brand.logo}
                        alt={getBrandName(brand, language)}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-3xl font-bold text-theme-primary break-words">{getBrandName(brand, language)}</h2>
                      {productCounts.has(brand.id) && (
                        <p className="text-sm text-theme-secondary mt-1">
                          {productCounts.get(brand.id)} {productCounts.get(brand.id) === 1 ? t('brands.product') : t('brands.products')}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-theme-secondary mb-6 leading-relaxed break-words">{brand.description}</p>
                  <div className="flex items-center text-primary-600 font-semibold group">
                    <span>{t('home.brands.view')}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
    </>
  );
}

