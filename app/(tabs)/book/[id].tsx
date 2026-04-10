import { useEffect, useState } from 'react';
import { DATA } from '@/app/hooks/books';
import { useLocalSearchParams } from 'expo-router';
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { type Book } from '@/app/types/Book';

export default function BookDetails() {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState<typeof DATA[0] | Book>({
    id: '',
    title: '',
    description: '',
    bookCover: '',
  });

  useEffect(() => {
    const fetchBookDetails = () => {
      return DATA.find((item) => item.id === id);
    };
    setBook(fetchBookDetails() || {
      id: '',
      title: '',
      description: '',
      bookCover: '',
    });
  }, [id]);

  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.bookTitle}>
        {book?.title}
      </Text>
      <View style={styles.bookHeader}>
        <Image
          source={{ uri: book?.bookCover }}
          style={styles.bookCover}
        />
        <View style={{ flex: 1, justifyContent: "center", gap: 10 }}>
          <Pressable
            style={styles.addToLibraryButton}
            onPress={() => alert('Book added to library!')}
            accessibilityLabel="Add this book to your library"
          >
            <Text style={{ color: '#004a77', fontWeight: '500' }}>Add to Library</Text>
          </Pressable>
          <Pressable
            style={styles.startReadingButton}
            onPress={() => alert('Starting reading!')}
            accessibilityLabel="Start reading this book"
          >
            
            <Text style={{ color: '#e8e6e3', fontWeight: '500' }}>Start Reading</Text>
          </Pressable>
        </View>
      </View>
      <hr style={{ width: "100%", backgroundColor: "#c1dddd", marginTop: 20 }} />
      <Text style={{ fontWeight: '500', marginTop: 10, color: "#c1dddd" }}>
        Description
      </Text>
      <View style={styles.bookDescription}>
        <Text style={styles.bookDescriptionContent}>
          {book?.description}
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#181a1b',
  },
  bookHeader: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    backgroundColor: "#202424",
    borderRadius: 8,
    padding: 10,
  },
  bookCover: {
    width: 125,
    height: 175,
    borderRadius: 8,
    objectFit: "cover",
  },
  bookTitle: {
    marginBottom: 10,
    color: "#c1dddd",
    fontSize: 24,
    fontWeight: '500',
  },
  bookDescription: {
    marginTop: 10,
    color: "#c1dddd",
    fontSize: 14,
    flexShrink: 1,
    fontWeight: '300',
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#202424",
    flexWrap: 'wrap',
  },
  bookDescriptionContent: {
    color: "#c1dddd",
    fontSize: 14,
    fontWeight: '300',
  },
  addToLibraryButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#7097d5",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  startReadingButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#323739",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
})