import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: '✓',
      title: t('about.values.quality.title'),
      description: t('about.values.quality.text'),
    },
    {
      icon: '🌱',
      title: t('about.values.sustainability.title'),
      description: t('about.values.sustainability.text'),
    },
    {
      icon: '🤝',
      title: t('about.values.customer.title'),
      description: t('about.values.customer.text'),
    },
    {
      icon: '🏆',
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.text'),
    },
  ];

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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 text-theme-primary">{t('about.title')}</h1>
          <p className="text-xl text-theme-secondary max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Company History */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-theme-card rounded-xl shadow-theme-lg p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-theme-primary">{t('about.history.title')}</h2>
            <div className="prose prose-lg max-w-none text-theme-secondary">
              <p className="mb-4">
                {t('about.history.text1')}
              </p>
              <p className="mb-4">
                {t('about.history.text2')}
              </p>
              <p>
                {t('about.history.text3')}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-theme-card rounded-xl shadow-theme-lg p-8"
          >
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold mb-4 text-theme-primary">{t('about.mission.title')}</h2>
            <p className="text-theme-secondary leading-relaxed">
              {t('about.mission.text')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-theme-card rounded-xl shadow-theme-lg p-8"
          >
            <div className="text-5xl mb-4">👁️</div>
            <h2 className="text-3xl font-bold mb-4 text-theme-primary">{t('about.vision.title')}</h2>
            <p className="text-theme-secondary leading-relaxed">
              {t('about.vision.text')}
            </p>
          </motion.div>
        </section>

        {/* Values Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-theme-primary">{t('about.values.title')}</h2>
            <p className="text-lg text-theme-secondary">
              {t('about.values.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-theme-card rounded-lg shadow-theme p-6 text-center hover:shadow-theme-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-theme-primary">{value.title}</h3>
                <p className="text-theme-secondary">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default About;
