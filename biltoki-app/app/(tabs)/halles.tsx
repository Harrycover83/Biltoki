import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, SafeAreaView, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { HALLES } from '../../data/halles';

export default function HallesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = HALLES.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.headerTag}>NOS HALLES</Text>
            <Text style={styles.headerTitle}>Des lieux vivants, gourmands et ouverts.</Text>
            <Text style={styles.headerText}>
              Retrouvez les halles Biltoki, leurs artisans, leurs tables et leurs rendez-vous.
            </Text>

            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une halle ou une ville..."
                placeholderTextColor={Colors.textSecondary}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="storefront-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>Aucune halle trouvée</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/halle/${item.id}` as any)}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardCity}>
                  <Ionicons name="location" size={13} color={Colors.rose} /> {item.city}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </View>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.cardAddress}>{item.address}</Text>
            <View style={styles.cardFooter}>
              <View style={[styles.pill, styles.pillGreen]}>
                <Ionicons name="time-outline" size={12} color={Colors.secondary} />
                <Text style={styles.pillText}>{item.hours}</Text>
              </View>
              <View style={[styles.pill, styles.pillRose]}>
                <Ionicons name="call-outline" size={12} color={Colors.rose} />
                <Text style={styles.pillText}>{item.phone}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerBlock: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  headerTag: { fontSize: 11, fontWeight: '900', color: Colors.textSecondary, letterSpacing: 2.2, textTransform: 'uppercase' },
  headerTitle: { marginTop: 10, fontSize: 28, lineHeight: 32, fontWeight: '900', color: Colors.primary, textTransform: 'uppercase' },
  headerText: { marginTop: 10, fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginTop: 16,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardImage: { width: '100%', height: 170 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '900', color: Colors.primary, textTransform: 'uppercase', lineHeight: 20 },
  cardCity: { fontSize: 12, color: Colors.rose, fontWeight: '800', marginTop: 4, letterSpacing: 0.5, textTransform: 'uppercase' },
  cardDescription: { paddingHorizontal: 16, marginTop: 8, fontSize: 13, lineHeight: 19, color: Colors.textSecondary },
  cardAddress: { fontSize: 12, color: Colors.textSecondary, paddingHorizontal: 16, marginTop: 10 },
  cardFooter: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  pillGreen: { backgroundColor: '#DCE8E0' },
  pillRose: { backgroundColor: '#F8D9E1' },
  pillText: { fontSize: 11, color: Colors.navy, fontWeight: '800' },
});
