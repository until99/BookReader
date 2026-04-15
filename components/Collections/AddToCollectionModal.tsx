import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, FlatList, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useCollections } from '@/hooks/useCollections';
import { Collection } from '@/types/Collection';

interface AddToCollectionModalProps {
  visible: boolean;
  bookId: string;
  bookTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddToCollectionModal({
  visible,
  bookId,
  bookTitle,
  onClose,
  onSuccess
}: AddToCollectionModalProps) {
  const { collections, addBookToCollection, getCollectionsForBook, createCollection, loading } = useCollections();
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [bookCollections, setBookCollections] = useState<string[]>([]);
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    if (visible && bookId) {
      loadBookCollections();
    }
  }, [visible, bookId]);

  const loadBookCollections = async () => {
    const collections = await getCollectionsForBook(bookId);
    setBookCollections(collections.map(c => c.id));
    setSelectedCollections(collections.map(c => c.id));
  };

  const handleToggleCollection = (collectionId: string) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleCreateAndAdd = async () => {
    if (!newCollectionName.trim()) {
      Alert.alert('Erro', 'Nome da coleção é obrigatório');
      return;
    }

    try {
      const newCollection = await createCollection(newCollectionName);
      setSelectedCollections(prev => [...prev, newCollection.id]);
      setNewCollectionName('');
      setShowNewCollectionForm(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a coleção');
    }
  };

  const handleSave = async () => {
    try {
      // Adicionar a livros que não estavam antes
      for (const collectionId of selectedCollections) {
        if (!bookCollections.includes(collectionId)) {
          await addBookToCollection(collectionId, bookId);
        }
      }

      // Remover de livros que foram desmarcados
      for (const collectionId of bookCollections) {
        if (!selectedCollections.includes(collectionId)) {
          // TODO: implementar removeBookFromCollection se necessário
        }
      }

      Alert.alert('Sucesso', 'Livro adicionado às coleções selecionadas!');
      onSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    }
  };

  return (
    <Modal
      visible={visible}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </Pressable>
          <Text style={styles.title}>Adicionar a Coleção</Text>
          <Pressable onPress={handleSave} disabled={loading}>
            <Text style={[styles.saveButton, loading && styles.saveButtonDisabled]}>
              {loading ? '...' : 'Salvar'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>"{bookTitle}"</Text>

          {showNewCollectionForm ? (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Nome da nova coleção</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Nome da coleção"
                placeholderTextColor="#888"
                value={newCollectionName}
                onChangeText={setNewCollectionName}
              />
              <View style={styles.inputGroup}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowNewCollectionForm(false);
                    setNewCollectionName('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={styles.createButton}
                  onPress={handleCreateAndAdd}
                >
                  <Text style={styles.createButtonText}>Criar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={styles.createNewButton}
              onPress={() => setShowNewCollectionForm(true)}
            >
              <Text style={styles.createNewText}>+ Criar nova coleção</Text>
            </Pressable>
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#004a77" style={styles.loader} />
          ) : collections.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma coleção disponível</Text>
              <Text style={styles.emptySubText}>Crie uma coleção para adicionar livros!</Text>
            </View>
          ) : (
            <FlatList
              data={collections}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.collectionItem,
                    selectedCollections.includes(item.id) && styles.collectionItemSelected
                  ]}
                  onPress={() => handleToggleCollection(item.id)}
                >
                  <View style={styles.checkbox}>
                    {selectedCollections.includes(item.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <View style={styles.collectionInfo}>
                    <Text style={styles.collectionName}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.collectionDesc} numberOfLines={1}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.collectionIcon}>{item.icon || '📚'}</Text>
                </Pressable>
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a1b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#c6e3e3',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c6e3e3',
  },
  saveButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004a77',
  },
  saveButtonDisabled: {
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  createNewButton: {
    backgroundColor: '#1f2223',
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  createNewText: {
    color: '#004a77',
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#1f2223',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#181a1b',
    color: '#e8e6e3',
    fontSize: 14,
    marginBottom: 12,
  },
  label: {
    color: '#c6e3e3',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#c6e3e3',
    fontWeight: '500',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#004a77',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#e8e6e3',
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c6e3e3',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 12,
    color: '#888',
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2223',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  collectionItemSelected: {
    backgroundColor: '#0d2a4a',
    borderWidth: 1,
    borderColor: '#004a77',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#004a77',
    fontSize: 14,
    fontWeight: 'bold',
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c6e3e3',
    marginBottom: 2,
  },
  collectionDesc: {
    fontSize: 12,
    color: '#666',
  },
  collectionIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
});
