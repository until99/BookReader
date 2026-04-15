import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal, TextInput, Alert } from 'react-native';
import { useCollections } from '@/hooks/useCollections';
import { CollectionCard } from './CollectionCard';
import { Collection } from '@/types/Collection';

export function CollectionList() {
  const { collections, createCollection, deleteCollection, loading } = useCollections();
  const [modalVisible, setModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      Alert.alert('Erro', 'Nome da coleção é obrigatório');
      return;
    }

    try {
      await createCollection(
        newCollectionName,
        newCollectionDescription || undefined,
        '#3498db',
        '📚'
      );
      setNewCollectionName('');
      setNewCollectionDescription('');
      setModalVisible(false);
      Alert.alert('Sucesso', 'Coleção criada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a coleção');
    }
  };

  const handleDeleteCollection = (id: string, name: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja deletar a coleção "${name}"?`,
      [
        { text: 'Cancelar', onPress: () => { } },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await deleteCollection(id);
              Alert.alert('Sucesso', 'Coleção deletada com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a coleção');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Coleções</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Criar nova coleção"
        >
          <Text style={styles.addButtonText}>+ Nova</Text>
        </Pressable>
      </View>

      {collections.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma coleção criada ainda</Text>
          <Text style={styles.emptySubText}>Crie sua primeira coleção para organizar seus livros!</Text>
        </View>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CollectionCard
              collection={item}
              onDelete={() => handleDeleteCollection(item.id, item.name)}
            />
          )}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={modalVisible}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Nova Coleção</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.label}>Nome da Coleção</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ficção Científica"
              placeholderTextColor="#888"
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />

            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição da sua coleção"
              placeholderTextColor="#888"
              value={newCollectionDescription}
              onChangeText={setNewCollectionDescription}
              multiline
              numberOfLines={4}
            />

            <Pressable
              style={styles.createButton}
              onPress={handleCreateCollection}
            >
              <Text style={styles.createButtonText}>Criar Coleção</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a1b',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c6e3e3',
  },
  addButton: {
    backgroundColor: '#004a77',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#e8e6e3',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c6e3e3',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#181a1b',
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c6e3e3',
  },
  modalContent: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c6e3e3',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#1f2223',
    color: '#e8e6e3',
    fontSize: 14,
    marginBottom: 16,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  createButton: {
    backgroundColor: '#004a77',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#e8e6e3',
    fontWeight: '600',
    fontSize: 16,
  },
});
