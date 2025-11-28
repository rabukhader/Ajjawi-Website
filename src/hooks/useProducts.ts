import { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import { productRepository } from '../repositories/product.repository';

export function useProducts(brandId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = brandId
          ? await productRepository.getByBrandId(brandId)
          : await productRepository.getAll();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandId]);

  return { products, loading, error, refetch: () => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = brandId
          ? await productRepository.getByBrandId(brandId)
          : await productRepository.getAll();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  } };
}

