import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/brands', label: t('nav.brands') },
    { path: '/products', label: t('nav.products') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 shadow-theme"
      style={{
        backgroundColor: 'var(--navbar-bg)',
        color: 'var(--navbar-text)',
        boxShadow: 'var(--navbar-shadow)',
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
            >
              Ajjawi
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600'
                    : 'text-theme-secondary hover:text-primary-600'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Theme and Language Switchers */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="flex items-center bg-theme-secondary rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-primary-600 text-white'
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'ar'
                    ? 'bg-primary-600 text-white'
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                AR
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-theme-secondary hover:bg-theme-tertiary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg
                  className="w-5 h-5 text-theme-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-theme-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-theme-secondary hover:text-primary-600 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                />

                {/* Mobile Menu Panel */}
                <motion.div
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 md:hidden shadow-2xl"
                  style={{
                    backgroundColor: 'var(--navbar-bg)',
                  }}
                >
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        Menu
                      </h2>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-theme-secondary transition-colors"
                        aria-label="Close menu"
                      >
                        <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto py-6 px-4">
                      <div className="flex flex-col space-y-2">
                        {navLinks.map((link, index) => (
                          <motion.div
                            key={link.path}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                          >
                            <Link
                              to={link.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`group relative px-4 py-3 font-medium transition-all duration-300 rounded-xl flex items-center ${
                                isActive(link.path)
                                  ? 'text-primary-600'
                                  : 'text-theme-secondary hover:text-primary-600'
                              }`}
                            >
                              {/* Active Indicator */}
                              {isActive(link.path) && (
                                <motion.div
                                  layoutId="mobile-active-indicator"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full"
                                  initial={false}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              )}

                              {/* Background on hover/active */}
                              <div
                                className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                                  isActive(link.path)
                                    ? 'bg-primary-50 dark:bg-primary-900/20'
                                    : 'bg-transparent group-hover:bg-theme-secondary'
                                }`}
                                style={{
                                  backgroundColor: isActive(link.path)
                                    ? theme === 'dark'
                                      ? 'rgba(234, 179, 8, 0.1)'
                                      : 'rgba(234, 179, 8, 0.1)'
                                    : 'transparent',
                                }}
                              />

                              {/* Link Content */}
                              <span className="relative z-10 flex items-center w-full">
                                <span className="flex-1">{link.label}</span>
                                <svg
                                  className={`w-5 h-5 transition-transform duration-300 ${
                                    isActive(link.path) ? 'translate-x-2' : 'translate-x-0 group-hover:translate-x-2'
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Footer with Theme/Language Switchers */}
                    <div
                      className="p-6 border-t"
                      style={{ borderColor: 'var(--border-primary)' }}
                    >
                      <div className="space-y-4">
                        {/* Language Switcher */}
                        <div>
                          <p className="text-sm font-semibold mb-2 text-theme-secondary">Language</p>
                          <div className="flex items-center bg-theme-secondary rounded-lg p-1">
                            <button
                              onClick={() => setLanguage('en')}
                              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                                language === 'en'
                                  ? 'bg-primary-600 text-white shadow-lg'
                                  : 'text-theme-secondary hover:text-theme-primary'
                              }`}
                            >
                              English
                            </button>
                            <button
                              onClick={() => setLanguage('ar')}
                              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                                language === 'ar'
                                  ? 'bg-primary-600 text-white shadow-lg'
                                  : 'text-theme-secondary hover:text-theme-primary'
                              }`}
                            >
                              العربية
                            </button>
                          </div>
                        </div>

                        {/* Theme Toggle */}
                        <div>
                          <p className="text-sm font-semibold mb-2 text-theme-secondary">Theme</p>
                          <button
                            onClick={toggleTheme}
                            className="w-full p-3 rounded-lg bg-theme-secondary hover:bg-theme-tertiary transition-all flex items-center justify-center space-x-2 group"
                          >
                            {theme === 'light' ? (
                              <>
                                <svg
                                  className="w-5 h-5 text-theme-primary group-hover:rotate-12 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                  />
                                </svg>
                                <span className="text-theme-primary font-medium">Dark Mode</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-5 h-5 text-theme-primary group-hover:rotate-12 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                  />
                                </svg>
                                <span className="text-theme-primary font-medium">Light Mode</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
