import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { ARTICLES, Article } from '../../data/actualites';

const NEWSLETTER_IMAGE = 'https://cdn.prod.website-files.com/69032f7aa92da3854968dc83/69e88a6b3f8f14683433c7d7_2025-12-BILTOKI-EmmaCORTIJO%20244-p-800.webp';

const CATEGORY_COLORS: Record<string, string> = {
  Actualité: Colors.primary,
  Producteurs: Colors.secondary,
  Recettes: Colors.orange,
  Événements: Colors.rose,
};

export default function ActualitesScreen() {
  const renderArticle = ({ item, index }: { item: Article; index: number }) => {
    const isFirst = index === 0;
    const color = CATEGORY_COLORS[item.category] ?? Colors.primary;

    if (isFirst) {
      return (
        <View style={styles.featured}>
          <Image source={{ uri: NEWSLETTER_IMAGE }} style={styles.featuredImage} />
          <View style={styles.featuredBody}>
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
            <Text style={styles.headerTitle}>Le journal de la place des bons vivants.</Text>
            <Text style={styles.headerText}>
              Plusieurs niveaux de lecture pour lire… ou picorer notre vision du monde.
            </Text>
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
    backgroundColor: Colors.card,
    borderRadius: 26,
    padding: 20,
    marginBottom: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  headerTitle: { fontSize: 27, lineHeight: 32, fontWeight: '900', color: Colors.primary, textTransform: 'uppercase' },
  headerText: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 8,
  },
  subscribeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  featured: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featuredImage: { width: '100%', height: 190 },
  featuredBody: { padding: 20 },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  featuredTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 8,
    lineHeight: 26,
  },
  featuredExcerpt: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21, marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 20,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardAccent: { width: 5 },
  cardContent: { flex: 1, padding: 14 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 6,
  },
  badgeText: { fontSize: 10, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  cardTitle: { fontSize: 15, fontWeight: '900', color: Colors.primary, marginBottom: 4 },
  cardExcerpt: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
});
