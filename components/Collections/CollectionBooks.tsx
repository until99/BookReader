import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useCollections } from '@/hooks/useCollections';
import { useRouter } from 'expo-router';
import { CollectionWithBooks } from '@/types/Collection';

interface CollectionBooksProps {
  collectionId: string;
}

export function CollectionBooks({ collectionId }: CollectionBooksProps) {
  const { fetchCollectionWithBooks, removeBookFromCollection } = useCollections();
  const [collectionData, setCollectionData] = useState<CollectionWithBooks | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCollectionData();
  }, [collectionId]);

  const loadCollectionData = async () => {
    setLoading(true);
    const data = await fetchCollectionWithBooks(collectionId);
    setCollectionData(data);
    setLoading(false);
  };

  const handleRemoveBook = (bookId: string, bookTitle: string) => {
    Alert.alert(
      'Remover Livro',
      `Tem certeza que deseja remover "${bookTitle}" desta coleção?`,
      [
        { text: 'Cancelar', onPress: () => { } },
        {
          text: 'Remover',
          onPress: async () => {
            try {
              await removeBookFromCollection(collectionId, bookId);
              await loadCollectionData();
              Alert.alert('Sucesso', 'Livro removido da coleção!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o livro');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004a77" />
      </View>
    );
  }

  if (!collectionData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Coleção não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: collectionData.color || '#3498db' }]}>
          <Text style={styles.icon}>{collectionData.icon || '📚'}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{collectionData.name}</Text>
          <Text style={styles.booksCount}>
            {collectionData.booksCount} {collectionData.booksCount === 1 ? 'livro' : 'livros'}
          </Text>
        </View>
      </View>

      {collectionData.description && (
        <Text style={styles.description}>{collectionData.description}</Text>
      )}

      {collectionData.booksCount === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum livro nesta coleção</Text>
          <Text style={styles.emptySubText}>Adicione livros para começar!</Text>
        </View>
      ) : (
        <FlatList
          data={collectionData.books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.bookItem}
              onPress={() => router.push(`/(tabs)/book/${item.id}`)}
            >
              <View style={styles.bookContent}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                {item.author && <Text style={styles.bookAuthor}>{item.author}</Text>}
              </View>
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemoveBook(item.id, item.title)}
              >
                <Text style={styles.removeIcon}>✕</Text>
              </Pressable>
            </Pressable>
          )}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a1b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181a1b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181a1b',
  },
  errorText: {
    color: '#c6e3e3',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1f2223',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 40,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c6e3e3',
    marginBottom: 4,
  },
  booksCount: {
    fontSize: 12,
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    padding: 16,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c6e3e3',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2223',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  bookContent: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c6e3e3',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#888',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  removeIcon: {
    fontSize: 18,
    color: '#ff6b6b',
  },
});
