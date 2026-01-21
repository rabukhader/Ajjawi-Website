import { useState, useEffect } from 'react';
import type { Brand } from '../types/product';
import { brandRepository } from '../repositories/brand.repository';

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getSortOrder = (id: number | string | undefined): number => {
    const idNum = typeof id === 'string' ? parseInt(id, 10) : (id || 0);
    
    if (idNum === 2) return 1;
    if (idNum === 1) return 2;
    if (idNum === 3) return 3;
    if (idNum === 4) return 4;
    if (idNum === 5) return 5;
    if (idNum === 14) return 9999;
    
    return 100 + idNum;
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await brandRepository.getAll();
        
        const sortedBrands = [...data].sort((a, b) => {
          const aOrder = getSortOrder(a.id);
          const bOrder = getSortOrder(b.id);
          return aOrder - bOrder;
        });
        
        setBrands(sortedBrands);

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

