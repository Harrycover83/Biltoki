import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { EVENEMENTS, Evenement } from '../../data/evenements';

const CATEGORIES = ['Tous', 'concert', 'tapas', 'banquet', 'atelier', 'marché'];

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  concert: 'musical-notes',
  tapas: 'restaurant',
  banquet: 'people',
  atelier: 'school',
  marché: 'basket',
};

const CATEGORY_COLORS: Record<string, string> = {
  concert: '#8B5CF6',
  tapas: '#EF4444',
  banquet: '#F59E0B',
  atelier: '#10B981',
  marché: '#3B82F6',
};

export default function EvenementsScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filtered =
    activeCategory === 'Tous'
      ? EVENEMENTS
      : EVENEMENTS.filter((e) => e.category === activeCategory);

  const renderEvent = ({ item }: { item: Evenement }) => {
    const color = CATEGORY_COLORS[item.category] ?? Colors.primary;
    const icon = CATEGORY_ICONS[item.category] ?? 'star';
    const dateObj = new Date(item.date);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/evenement/${item.id}` as any)}
      >
        <View style={[styles.dateStripe, { backgroundColor: color }]}>
          <Text style={styles.dateDay}>{dateObj.getDate()}</Text>
          <Text style={styles.dateMonth}>
            {dateObj.toLocaleString('fr-FR', { month: 'short' }).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.categoryRow}>
            <Ionicons name={icon} size={14} color={color} />
            <Text style={[styles.categoryLabel, { color }]}>{item.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardExcerpt} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardMeta}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.cardMetaText}>{item.halleName} · {item.city}</Text>
          </View>
          <View style={styles.cardMeta}>
            <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.cardMetaText}>{item.time}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} style={{ alignSelf: 'center' }} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.filterWrapper}>
            <FlatList
              data={CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(c) => c}
              contentContainerStyle={styles.filterList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.filterChip, activeCategory === item && styles.filterChipActive]}
                  onPress={() => setActiveCategory(item)}
                >
                  <Text style={[styles.filterText, activeCategory === item && styles.filterTextActive]}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>Aucun événement</Text>
          </View>
        }
        renderItem={renderEvent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  filterWrapper: { backgroundColor: Colors.background },
  filterList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  filterText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.5 },
  filterTextActive: { color: Colors.white },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.darkBrown,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  dateStripe: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  dateDay: { color: Colors.white, fontSize: 22, fontWeight: '800' },
  dateMonth: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cardContent: { flex: 1, padding: 14 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  categoryLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.navy, marginBottom: 4 },
  cardExcerpt: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, lineHeight: 17 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  cardMetaText: { fontSize: 11, color: Colors.textSecondary },
});
