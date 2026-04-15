import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Collection } from '@/types/Collection';

interface CollectionCardProps {
  collection: Collection;
  onDelete: () => void;
}

export function CollectionCard({ collection, onDelete }: CollectionCardProps) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/collections/${collection.id}`)}
    >
      <View style={[styles.iconContainer, { backgroundColor: collection.color || '#3498db' }]}>
        <Text style={styles.icon}>{collection.icon || '📚'}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{collection.name}</Text>
        {collection.description && (
          <Text style={styles.description} numberOfLines={2}>
            {collection.description}
          </Text>
        )}
      </View>

      <Pressable
        style={styles.deleteButton}
        onPress={onDelete}
        accessibilityLabel={`Deletar coleção ${collection.name}`}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2223',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c6e3e3',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
});
