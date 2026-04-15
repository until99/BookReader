import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, TextInput, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useBooks } from '@/hooks/useBooks';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

interface UploadBookModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UploadBookModal({ visible, onClose, onSuccess }: UploadBookModalProps) {
  const { uploadBook } = useBooks();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedCover, setSelectedCover] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [uploading, setUploading] = useState(false);

  const validateImage = (uri: string, size: number): { valid: boolean; error?: string } => {
    if (size > MAX_IMAGE_SIZE) {
      const sizeMB = (MAX_IMAGE_SIZE / (1024 * 1024)).toFixed(0);
      return {
        valid: false,
        error: `Imagem muito grande. Máximo: ${sizeMB}MB (seu arquivo: ${(size / (1024 * 1024)).toFixed(2)}MB)`
      };
    }
    return { valid: true };
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/epub+zip', 'application/pdf', '.epub', '.pdf'],
      } as any);

      if ('assets' in result && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedFile(asset);
        const fileName = asset.name?.replace(/\.[^/.]+$/, '') || 'Livro';
        setTitle(fileName);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo');
    }
  };

  const handlePickCover = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Validar tamanho
        if (asset.fileSize) {
          const validation = validateImage(asset.uri, asset.fileSize);
          if (!validation.valid) {
            Alert.alert('Erro', validation.error);
            return;
          }
        }

        setSelectedCover({
          uri: asset.uri,
          type: 'image/png',
          name: `cover-${Date.now()}.png`,
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Erro', 'Selecione um arquivo primeiro');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return;
    }

    setUploading(true);
    try {
      // Preparar arquivo principal
      const fileResponse = await fetch(selectedFile.uri);
      const fileBlob = await fileResponse.blob();

      const formData = new FormData();
      formData.append('file', fileBlob as any, selectedFile.name);
      formData.append('title', title);
      if (author.trim()) {
        formData.append('author', author);
      }

      // Adicionar capa se fornecida
      if (selectedCover) {
        const coverResponse = await fetch(selectedCover.uri);
        const coverBlob = await coverResponse.blob();
        formData.append('cover', coverBlob as any, selectedCover.name);
      }

      await uploadBook(formData);

      Alert.alert('Sucesso', 'Livro enviado com sucesso!');
      setSelectedFile(null);
      setSelectedCover(null);
      setTitle('');
      setAuthor('');
      onSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setUploading(false);
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
          <Pressable onPress={onClose} disabled={uploading}>
            <Text style={styles.closeButton}>✕</Text>
          </Pressable>
          <Text style={styles.modalTitle}>Adicionar Livro</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.fileSection}>
            <Text style={styles.label}>Arquivo do Livro</Text>
            <Pressable
              style={[styles.button, styles.pickButton]}
              onPress={handlePickDocument}
              disabled={uploading}
            >
              <Text style={styles.buttonText}>
                {selectedFile ? '📄 Arquivo selecionado' : '📂 Selecionar Arquivo'}
              </Text>
            </Pressable>
            {selectedFile && (
              <Text style={styles.selectedFile}>{selectedFile.name}</Text>
            )}
          </View>

          <View style={styles.coverSection}>
            <Text style={styles.label}>Capa do Livro (Opcional)</Text>
            <Text style={styles.hint}>Suporta: PNG, JPEG, WebP (máx. 10MB)</Text>
            <Pressable
              style={[styles.button, styles.pickButton]}
              onPress={handlePickCover}
              disabled={uploading}
            >
              {selectedCover ? (
                <Image
                  source={{ uri: selectedCover.uri }}
                  style={styles.coverPreview}
                />
              ) : (
                <Text style={styles.buttonText}>🖼️ Selecionar Capa</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Título do Livro</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Dune"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
              editable={!uploading}
            />

            <Text style={styles.label}>Autor (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Frank Herbert"
              placeholderTextColor="#888"
              value={author}
              onChangeText={setAuthor}
              editable={!uploading}
            />
          </View>

          <Pressable
            style={[styles.button, styles.uploadButton, uploading && styles.uploadButtonDisabled]}
            onPress={handleUpload}
            disabled={uploading || !selectedFile}
          >
            {uploading ? (
              <ActivityIndicator color="#e8e6e3" />
            ) : (
              <Text style={styles.uploadButtonText}>Fazer Upload</Text>
            )}
          </Pressable>
        </ScrollView>
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c6e3e3',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  fileSection: {
    marginBottom: 20,
  },
  coverSection: {
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c6e3e3',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickButton: {
    borderWidth: 2,
    borderColor: '#004a77',
    borderStyle: 'dashed',
    backgroundColor: '#0a1929',
  },
  buttonText: {
    color: '#004a77',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedFile: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic',
  },
  coverPreview: {
    width: 80,
    height: 120,
    borderRadius: 6,
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
  uploadButton: {
    backgroundColor: '#004a77',
    paddingVertical: 14,
  },
  uploadButtonDisabled: {
    backgroundColor: '#003355',
    opacity: 0.5,
  },
  uploadButtonText: {
    color: '#e8e6e3',
    fontWeight: '600',
    fontSize: 16,
  },
});
