import Ionicons from "@expo/vector-icons/Ionicons"
import { FlatList, StyleSheet, Text, View } from "react-native"
import Book from "./layout/Book"



export default function Carrousel({ title, data }: { title: string, data: { id: string, title: string, bookCover: string, description: string }[] }) {
  return (
    <View style={{ marginBottom: 40 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name="arrow-forward" color="#c6e3e3" size={24} />
      </View>
      <FlatList
        style={styles.carrousel}
        data={data}
        renderItem={({ item }) => <Book id={item.id} title={item.title} bookCover={item.bookCover} description={item.description} />}
        keyExtractor={item => item.id}
        horizontal={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#c6e3e3",
    fontSize: 24,
    fontWeight: '500',
  },
  carrousel: {
    flexGrow: 0,
    height: 350,
  },
  book: {
    marginVertical: 8,
    marginRight: 24,
    width: 200,
  },

})
