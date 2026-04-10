import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView } from 'react-native';
import Carrousel from '../components/Carrousel';
import { DATA } from '../hooks/books';
import { Book } from '../types/Book';

export default function Index() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(DATA);
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Carrousel title="Trending" data={books} />
        <Carrousel title="Latest Updates" data={books} />
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181a1b",
    padding: 20,
  },
})