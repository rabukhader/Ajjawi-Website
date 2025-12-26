import type { Brand } from '../types/product';

/**
 * Get the brand name based on the current language
 * @param brand - The brand object
 * @param language - The current language ('en' | 'ar')
 * @returns The brand name in the appropriate language, or '---' if not available
 */
export function getBrandName(brand: Brand | null | undefined, language: 'en' | 'ar'): string {
  if (!brand) {
    return '---';
  }

  if (language === 'en') {
    // Use nameEnglish for English, fallback to name if nameEnglish is not available
    return brand.nameEnglish || brand.name || '---';
  } else {
    // Use name for Arabic
    return brand.name || '---';
  }
}

