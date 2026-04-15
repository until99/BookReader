import { useRouter } from 'expo-router';
import {
  Image, Pressable, StyleSheet, Text, ActivityIndicator, View
} from "react-native";
import { useState } from 'react';

type ItemProps = { id: string; title: string; bookCover: string, description: string };

export default function Book({ id, title, bookCover, description }: ItemProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Pressable
      style={styles.book}
      onPress={() => router.push({
        pathname: '/book/[id]',
        params: { id }
      })}
    >
      <View style={styles.imageContainer}>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#004a77"
            style={styles.loader}
          />
        )}
        <Image
          source={{ uri: bookCover }}
          style={styles.image}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>📕</Text>
          </View>
        )}
      </View>
      <Text style={styles.bookTitle} numberOfLines={2}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  book: {
    marginVertical: 8,
    marginRight: 24,
    width: 200,
  },
  imageContainer: {
    width: "100%",
    height: "90%",
    backgroundColor: "#1f2223",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  loader: {
    position: "absolute",
    zIndex: 10,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f2223",
  },
  errorText: {
    fontSize: 48,
  },
  bookTitle: {
    marginTop: 5,
    color: "#c1dddd",
    fontSize: 16,
    fontWeight: '500',
  },
});
