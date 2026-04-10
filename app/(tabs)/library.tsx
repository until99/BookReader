import { Text, View, StyleSheet } from 'react-native';

export default function LibraryScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#181a1b",
      }}
    >
      <Text style={styles.text}>
        Library
      </Text>
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
    color: "#c6e3e3"
  }
})