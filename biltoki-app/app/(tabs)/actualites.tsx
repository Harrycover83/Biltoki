import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { ARTICLES, Article } from '../../data/actualites';

const CATEGORY_COLORS: Record<string, string> = {
  Actualité: Colors.primary,
  Producteurs: Colors.secondary,
  Recettes: '#F59E0B',
  Événements: '#8B5CF6',
};

export default function ActualitesScreen() {
  const renderArticle = ({ item, index }: { item: Article; index: number }) => {
    const isFirst = index === 0;
    const color = CATEGORY_COLORS[item.category] ?? Colors.primary;

    if (isFirst) {
      return (
        <View style={styles.featured}>
          <View style={[styles.featuredBadge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
          <Text style={styles.featuredTitle}>{item.title}</Text>
          <Text style={styles.featuredExcerpt}>{item.excerpt}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              <Ionicons name="calendar-outline" size={12} /> {new Date(item.date).toLocaleDateString('fr-FR')}
            </Text>
            <Text style={styles.metaText}>
              <Ionicons name="time-outline" size={12} /> {item.readTime}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <View style={[styles.cardAccent, { backgroundColor: color }]} />
        <View style={styles.cardContent}>
          <View style={[styles.badge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.badgeText, { color }]}>{item.category}</Text>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardExcerpt} numberOfLines={2}>{item.excerpt}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {new Date(item.date).toLocaleDateString('fr-FR')}
            </Text>
            <Text style={styles.metaText}>{item.readTime}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={ARTICLES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerLabel}>NEWSLETTER BILTOKI</Text>
            <TouchableOpacity style={styles.subscribeBtn}>
              <Ionicons name="mail" size={16} color={Colors.white} />
              <Text style={styles.subscribeBtnText}>S'abonner à la newsletter</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={renderArticle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, paddingBottom: 32 },
  header: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  subscribeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  featured: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  featuredExcerpt: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21, marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardAccent: { width: 5 },
  cardContent: { flex: 1, padding: 14 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  cardExcerpt: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
});
