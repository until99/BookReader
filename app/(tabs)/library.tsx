import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function LibraryScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#181a1b",
        padding: 20,
      }}
    >
      <Text style={styles.text}>
        Biblioteca
      </Text>

      <Pressable
        style={styles.collectionButton}
        onPress={() => router.push('/collections')}
        accessibilityLabel="View your collections"
      >
        <Text style={styles.collectionButtonText}>📚 Minhas Coleções</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a1b",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  text: {
    color: "#c6e3e3",
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  collectionButton: {
    backgroundColor: '#1f2223',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  collectionButtonText: {
    color: '#c6e3e3',
    fontSize: 16,
    fontWeight: '600',
  },
})