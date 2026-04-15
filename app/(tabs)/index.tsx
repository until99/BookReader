import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, Pressable, Text, ActivityIndicator, View } from 'react-native';
import Carrousel from '@/components/Carrousel';
import { useBooks } from '@/hooks/useBooks';
import { UploadBookModal } from '@/components/UploadBookModal';

export default function Index() {
  const { books, loading, fetchBooks } = useBooks();
  const [modalVisible, setModalVisible] = useState(false);

  const handleUploadSuccess = () => {
    fetchBooks();
  };

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#004a77" />
          <Text style={styles.loadingText}>Carregando livros...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>Minha Biblioteca</Text>
          <Pressable
            style={styles.uploadButton}
            onPress={() => setModalVisible(true)}
            accessibilityLabel="Adicionar novo livro"
          >
            <Text style={styles.uploadButtonText}>+ Adicionar</Text>
          </Pressable>
        </View>

        {books.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum livro adicionado</Text>
            <Text style={styles.emptySubText}>Clique em "+ Adicionar" para seu primeiro livro!</Text>
          </View>
        ) : (
          <>
            <Carrousel title="Recentes" data={books} />
            {books.length > 4 && <Carrousel title="Todos os Livros" data={books} />}
          </>
        )}
      </ScrollView>

      <UploadBookModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handleUploadSuccess}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181a1b",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#c6e3e3',
    fontSize: 14,
    marginTop: 12,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 10,
  },
  headerText: {
    color: '#c6e3e3',
    fontSize: 20,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#004a77',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#e8e6e3',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c6e3e3',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
})