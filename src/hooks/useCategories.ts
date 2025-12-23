import { useState, useEffect } from 'react';
import type { Category } from '../mappers/category.mapper';
import { categoryRepository } from '../repositories/category.repository';
import { mapApiCategoriesToCategories } from '../mappers/category.mapper';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const apiCategories = await categoryRepository.getAll();
        const mappedCategories = mapApiCategoriesToCategories(apiCategories);
        setCategories(mappedCategories);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: () => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const apiCategories = await categoryRepository.getAll();
        const mappedCategories = mapApiCategoriesToCategories(apiCategories);
        setCategories(mappedCategories);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  } };
}

