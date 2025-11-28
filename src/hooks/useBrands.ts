import { useState, useEffect } from 'react';
import type { Brand } from '../types/product';
import { brandRepository } from '../repositories/brand.repository';

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await brandRepository.getAll();
        setBrands(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch brands'));
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error, refetch: () => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await brandRepository.getAll();
        setBrands(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch brands'));
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  } };
}

