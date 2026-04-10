import { useRouter } from 'expo-router';
import {
  Image, Pressable, StyleSheet, Text
} from "react-native";

type ItemProps = { id: string; title: string; bookCover: string, description: string };

export default function Book({ id, title, bookCover, description }: ItemProps) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.book}
      onPress={() => router.push({
        pathname: '/book/[id]',
        params: { id }
      })}
    >
      <Image
        source={{ uri: `${bookCover}` }}
        style={{ width: "100%", height: "90%", objectFit: "cover", }}
      />
      <Text style={styles.bookTitle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  book: {
    marginVertical: 8,
    marginRight: 24,
    width: 200,
  },
  bookTitle: {
    marginTop: 5,
    color: "#c1dddd",
    fontSize: 16,
    fontWeight: '500',
  },
});