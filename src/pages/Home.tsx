import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useBrands } from '../hooks/useBrands';
import { heroImages } from '../../data/hero-images';

const Home = () => {
  const { t } = useLanguage();
  const { brands: brandsData } = useBrands();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroImages.length === 0) return;
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [heroImages.length]);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <section className="relative h-[600px] overflow-hidden">
        {heroImages.length > 0 ? (
          <>
            {heroImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
            }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 ${
              currentSlide === index ? 'z-10' : 'z-0'
            }`}
          >
            <img
              src={image}
              alt={`Hero slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
        ))}

        <div className="relative z-20 flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {t('home.hero.title')} <span className="text-primary-400">Ajjawi</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <Link
              to="/brands"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {t('home.hero.cta')}
            </Link>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-primary-400 w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                {t('home.hero.title')} <span className="text-primary-200">Ajjawi</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                {t('home.hero.subtitle')}
              </p>
              <Link
                to="/brands"
                className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                {t('home.hero.cta')}
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-theme-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-theme-primary">
              {t('home.about.title')}
            </h2>
            <p className="text-lg text-theme-secondary leading-relaxed">
              {t('home.about.text')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Explore Our Brands Section */}
      <section className="py-20 bg-theme-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-theme-primary">{t('home.brands.title')}</h2>
            <p className="text-lg text-theme-secondary">{t('home.brands.subtitle')}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {brandsData.map((brand) => (
              <motion.div
                key={brand.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-theme-card rounded-lg shadow-theme overflow-hidden hover:shadow-theme-lg transition-shadow"
              >
                <Link to={`/brands/${brand.id}`}>
                  <div className="p-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-center text-theme-primary">
                      {brand.name}
                    </h3>
                    <p className="text-theme-secondary text-sm text-center line-clamp-3">
                      {brand.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel - Removed, will be added via API if needed */}
      
      {/* Customer Reviews Section - Removed, will be added via API if needed */}
      
      {/* Photo Album Grid - Removed, will be added via API if needed */}
    </div>
  );
};

export default Home;

