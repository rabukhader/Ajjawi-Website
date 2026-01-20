import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useState, useEffect, useMemo } from 'react';
import type { Brand } from '../../src/types/product';
import { brandRepository } from '../../src/repositories/brand.repository';
import { useProducts } from '../../src/hooks/useProducts';
import { useCategories } from '../../src/hooks/useCategories';
import ProductCard from '../../src/components/ProductCard';
import { getBrandName } from '../../src/utils/brand.utils';

export default function BrandDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useLanguage();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch products for this brand
  const { products: allProducts, loading: productsLoading } = useProducts();
  const { categories: categoriesData } = useCategories();
  
  // Filter products by brandId and exclude hidden products
  const brandProducts = allProducts.filter((product) => 
    product.brandId === id && product.isHidden !== true
  );

  // Create a map of categoryId to category name
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categoriesData.forEach((category) => {
      map.set(parseInt(category.id), category.name);
    });
    return map;
  }, [categoriesData]);

  useEffect(() => {
    const fetchBrand = async () => {
      if (!id || typeof id !== 'string') return;
      
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
          <Link href="/brands" className="text-primary-600 hover:underline">
            {t('brand.detail.back')}
          </Link>
        </div>
      </div>
    );
  }

  const brandName = brand ? getBrandName(brand, language) : '';

  return (
    <>
      <Head>
        <title>
          {brandName 
            ? `${brandName} | Ajjawi`
            : `${t('nav.brands')} | Ajjawi`}
        </title>
        <meta name="description" content={brand?.description || ''} />
      </Head>
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
            href="/brands"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <svg
              className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 rtl:scale-x-[-1]"
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
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 md:mb-0 md:mr-8 rtl:md:mr-0 rtl:md:ml-8 flex-shrink-0 relative">
              <Image src={brand.logo} alt={getBrandName(brand, language)} fill className="object-cover" unoptimized />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4 text-theme-primary">{getBrandName(brand, language)}</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {brandProducts.map((product) => (
                <div key={product.id} className="h-full" style={{ width: '250px' }}>
                  <ProductCard
                    product={product}
                    brandName={getBrandName(brand, language)}
                    categoryName={product.categoryId !== undefined ? categoryMap.get(product.categoryId) : undefined}
                    t={t}
                    showBrand={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

