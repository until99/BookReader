import { useState, useEffect, useCallback } from 'react';
import type { Collection, CollectionWithBooks } from '@/types/Collection';

const API_URL = 'http://localhost:3000/api/v1/collections';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCollections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar coleções');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCollectionWithBooks = useCallback(async (collectionId: string): Promise<CollectionWithBooks | null> => {
    try {
      const response = await fetch(`${API_URL}/${collectionId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar coleção');
      return null;
    }
  }, []);

  const createCollection = useCallback(async (name: string, description?: string, color?: string, icon?: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, color, icon })
      });
      const data = await response.json();
      if (response.ok) {
        await fetchCollections();
        return data.collection;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar coleção');
      throw err;
    }
  }, [fetchCollections]);

  const updateCollection = useCallback(async (id: string, name?: string, description?: string, color?: string, icon?: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, color, icon })
      });
      const data = await response.json();
      if (response.ok) {
        await fetchCollections();
        return data.collection;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar coleção');
      throw err;
    }
  }, [fetchCollections]);

  const deleteCollection = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchCollections();
      } else {
        throw new Error('Erro ao deletar coleção');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar coleção');
      throw err;
    }
  }, [fetchCollections]);

  const addBookToCollection = useCallback(async (collectionId: string, bookId: string) => {
    try {
      const response = await fetch(`${API_URL}/${collectionId}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar livro');
      throw err;
    }
  }, []);

  const removeBookFromCollection = useCallback(async (collectionId: string, bookId: string) => {
    try {
      const response = await fetch(`${API_URL}/${collectionId}/books/${bookId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Erro ao remover livro');
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover livro');
      throw err;
    }
  }, []);

  const isBookInCollection = useCallback(async (collectionId: string, bookId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/${collectionId}/books/${bookId}`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.isInCollection;
    } catch (err) {
      return false;
    }
  }, []);

  const getCollectionsForBook = useCallback(async (bookId: string): Promise<Collection[]> => {
    try {
      const response = await fetch(`${API_URL}/book/${bookId}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (err) {
      return [];
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return {
    collections,
    loading,
    error,
    fetchCollections,
    fetchCollectionWithBooks,
    createCollection,
    updateCollection,
    deleteCollection,
    addBookToCollection,
    removeBookFromCollection,
    isBookInCollection,
    getCollectionsForBook
  };
}
