export interface Collection {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionWithBooks extends Collection {
  books: Array<{
    id: string;
    title: string;
    author: string | null;
    bookCover?: string;
    added_at: string;
  }>;
  booksCount: number;
}
