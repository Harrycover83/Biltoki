import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SCAFFOLD_SECTIONS } from './src/scaffold/sections';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Biltoki App Scaffold</Text>
      {SCAFFOLD_SECTIONS.map((section) => (
        <View key={section.title} style={styles.card}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item) => (
            <Text key={item} style={styles.item}>{`• ${item}`}</Text>
          ))}
        </View>
      ))}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#faf7f0',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1d2a30',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d2a30',
  },
  item: {
    fontSize: 14,
    color: '#43535d',
  },
});
