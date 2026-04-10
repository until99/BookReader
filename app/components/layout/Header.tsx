import { StyleSheet, View, Text } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Delfos Books</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0e0f13",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
});