import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet } from 'react-native';
import Header from '@/components/layout/Header';
import { CollectionList } from '@/components/Collections/CollectionList';

export default function CollectionsScreen() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CollectionList />
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a1b',
  },
});
