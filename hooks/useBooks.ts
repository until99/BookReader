import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:3000/api/v1/books';

export interface Book {
  id: string;
  title: string;
  author?: string;
  file_path: string;
  cover_path?: string;
  created_at: string;
  bookCover?: string;
  description?: string;
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar livros');
      const data = await response.json();
      // Mapear para incluir bookCover e description
      const mappedBooks = data.map((book: any) => ({
        ...book,
        // Usar capa do servidor se disponível, senão usar placeholder
        bookCover: book.cover_path
          ? `http://localhost:3000/api/v1/books/covers/${book.cover_path}`
          : 'https://via.placeholder.com/200x300?text=' + encodeURIComponent(book.title.substring(0, 20)),
        description: book.title + ' por ' + (book.author || 'Autor Desconhecido')
      }));
      setBooks(mappedBooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar livros');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadBook = useCallback(async (formData: FormData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao fazer upload');
      }

      const newBook = await response.json();
      // Mapear novo livro com bookCover e description
      const mappedBook = {
        ...newBook.book,
        bookCover: newBook.book.cover_path
          ? `http://localhost:3000/api/v1/books/covers/${newBook.book.cover_path}`
          : 'https://via.placeholder.com/200x300?text=' + encodeURIComponent(newBook.book.title.substring(0, 20)),
        description: newBook.book.title + ' por ' + (newBook.book.author || 'Autor Desconhecido')
      };
      setBooks(prev => [mappedBook, ...prev]);
      return mappedBook;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
      throw err;
    }
  }, []);

  const deleteBook = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao deletar livro');
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar livro');
      throw err;
    }
  }, []);

  const updateBookCover = useCallback(async (bookId: string, coverFile: Blob) => {
    try {
      const formData = new FormData();
      formData.append('cover', coverFile);

      const response = await fetch(`${API_URL}/${bookId}/cover`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar capa');
      }

      const updatedBook = await response.json();
      // Atualizar livro na lista
      setBooks(prev =>
        prev.map(b =>
          b.id === bookId
            ? {
              ...updatedBook.book,
              bookCover: updatedBook.book.cover_path
                ? `http://localhost:3000/api/v1/books/covers/${updatedBook.book.cover_path}`
                : b.bookCover,
              description: b.description
            }
            : b
        )
      );

      return updatedBook.book;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar capa');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    fetchBooks,
    uploadBook,
    deleteBook,
    updateBookCover
  };
}
