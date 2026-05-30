import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, SafeAreaView,
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
      {/* Barre de recherche */}
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Ionicons name="storefront" size={24} color={Colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardCity}>
                  <Ionicons name="location" size={13} color={Colors.primary} /> {item.city}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </View>
            <Text style={styles.cardAddress}>{item.address}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.pill}>
                <Ionicons name="time-outline" size={12} color={Colors.secondary} />
                <Text style={styles.pillText}>{item.hours}</Text>
              </View>
              <View style={styles.pill}>
                <Ionicons name="call-outline" size={12} color={Colors.secondary} />
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    margin: 16,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.darkBrown,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.darkBrown,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconBox: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '800', color: Colors.navy },
  cardCity: { fontSize: 12, color: Colors.primary, fontWeight: '700', marginTop: 2, letterSpacing: 0.3 },
  cardAddress: { fontSize: 12, color: Colors.textSecondary, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  pillText: { fontSize: 11, color: Colors.navy, fontWeight: '700' },
});
