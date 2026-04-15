import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/layout/Header';
import { CollectionBooks } from '@/components/Collections/CollectionBooks';

export default function CollectionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
        <View style={styles.backButtonContainer}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {id && <CollectionBooks collectionId={id as string} />}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a1b',
  },
  headerContainer: {
    backgroundColor: '#0e0f13',
  },
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004a77',
  },
});
