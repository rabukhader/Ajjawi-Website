import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import brandsData from '../../data/brands.json';

const Brands = () => {
  const { t } = useLanguage();

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

  return (
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {brandsData.map((brand) => (
            <motion.div
              key={brand.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-theme-card rounded-xl shadow-theme-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link to={`/brands/${brand.id}`}>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden mr-6 rtl:mr-0 rtl:ml-6 flex-shrink-0">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-3xl font-bold text-theme-primary">{brand.name}</h2>
                  </div>
                  <p className="text-theme-secondary mb-6 leading-relaxed">{brand.description}</p>
                  <div className="flex items-center text-primary-600 font-semibold group">
                    <span>{t('home.brands.view')}</span>
                    <svg
                      className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Brands;
