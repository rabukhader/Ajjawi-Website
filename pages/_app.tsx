import type { AppProps } from 'next/app';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import '../src/index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex flex-col bg-theme-primary" style={{ minHeight: 0, height: 'auto' }}>
          <Navbar />
          <main style={{ flex: '0 0 auto', minHeight: 0, height: 'auto' }}>
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

