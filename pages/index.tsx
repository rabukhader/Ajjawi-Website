import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useLanguage } from '../src/contexts/LanguageContext';
import { heroImages } from '../data/hero-images';
import homeContent from '../data/home-content.json';

export default function Home() {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  useEffect(() => {
    if (heroImages.length === 0) return;
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % homeContent.testimonials.length);
    }, 6000);

    return () => clearInterval(testimonialInterval);
  }, []);

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
    <>
      <Head>
        <title>{t('nav.home')} | Ajjawi</title>
        <meta name="description" content={t('home.hero.subtitle')} />
      </Head>
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
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`Hero slide ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
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
              href="/brands"
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
                href="/brands"
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


      {/* Testimonials Carousel */}
      <section className="py-20 bg-theme-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-theme-primary">{t('home.testimonials.title')}</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative h-80 overflow-hidden rounded-xl">
              {homeContent.testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: index > currentTestimonial ? 100 : -100 }}
                  animate={{
                    opacity: currentTestimonial === index ? 1 : 0,
                    x: currentTestimonial === index ? 0 : index > currentTestimonial ? 100 : -100,
                  }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 ${
                    currentTestimonial === index ? 'z-10' : 'z-0'
                  }`}
                >
                  <div className="bg-theme-card rounded-xl shadow-theme-lg p-8 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-6 ring-4 ring-primary-200 relative">
                      <Image
                        src={testimonial.image}
                        alt={language === 'ar' ? testimonial.nameAr : testimonial.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-lg text-theme-secondary mb-6 italic leading-relaxed">
                      &ldquo;{language === 'ar' ? testimonial.textAr : testimonial.text}&rdquo;
                    </p>
                    <div>
                      <h4 className="text-xl font-bold text-theme-primary mb-1">
                        {language === 'ar' ? testimonial.nameAr : testimonial.name}
                      </h4>
                      <p className="text-sm text-theme-secondary">
                        {language === 'ar' ? testimonial.positionAr : testimonial.position} - {language === 'ar' ? testimonial.companyAr : testimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {homeContent.testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentTestimonial === index ? 'bg-primary-600 w-8' : 'bg-theme-border w-2'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-theme-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-theme-primary">{t('home.reviews.title')}</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {homeContent.reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-theme-card rounded-lg shadow-theme p-6 hover:shadow-theme-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-theme-primary mb-1">
                      {language === 'ar' ? review.nameAr : review.name}
                    </h4>
                    <p className="text-xs text-theme-secondary">{review.date}</p>
                  </div>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-theme-secondary leading-relaxed">
                  {language === 'ar' ? review.textAr : review.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photo Album Grid */}
      <section className="py-20 bg-theme-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-theme-primary">{t('home.photos.title')}</h2>
            <p className="text-lg text-theme-secondary">{t('home.photos.subtitle')}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {homeContent.photos.map((photo) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-theme hover:shadow-theme-lg transition-shadow"
                onClick={() => setSelectedPhoto(photo.id)}
              >
                <div className="aspect-square overflow-hidden relative">
                  <Image
                    src={photo.url}
                    alt={language === 'ar' ? photo.titleAr : photo.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-white font-semibold text-lg">
                      {language === 'ar' ? photo.titleAr : photo.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {homeContent.photos.find(p => p.id === selectedPhoto)?.url && (
              <Image
                src={homeContent.photos.find(p => p.id === selectedPhoto)!.url}
                alt={language === 'ar' 
                  ? homeContent.photos.find(p => p.id === selectedPhoto)?.titleAr || ''
                  : homeContent.photos.find(p => p.id === selectedPhoto)?.title || ''}
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
                unoptimized
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
    </>
  );
}

