import React from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  Image, Dimensions, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { EVENEMENTS } from '../../data/evenements';
import { HALLES } from '../../data/halles';

const { width } = Dimensions.get('window');

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  concert: 'musical-notes',
  tapas: 'restaurant',
  banquet: 'people',
  atelier: 'school',
  marché: 'basket',
};

export default function HomeScreen() {
  const router = useRouter();
  const upcomingEvents = EVENEMENTS.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTagline}>LA PLACE DES BONS VIVANTS</Text>
          <Text style={styles.heroTitle}>Bienvenue{`\n`}chez{' '}
            <Text style={styles.heroTitleAccent}>BiLToki</Text>
          </Text>
          <Text style={styles.heroSub}>
            On se salue, on slalome entre les stands, on remplit son panier, on mange un morceau.
          </Text>
          <View style={styles.heroValues}>
            {['PARTAGE', 'CONVIVIALITÉ', 'AUTHENTICITÉ'].map((v) => (
              <View key={v} style={styles.valueTag}>
                <Text style={styles.valueText}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Accès rapide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explorer</Text>
          <View style={styles.quickGrid}>
            {[
              { icon: 'storefront', label: 'Nos Halles', route: '/halles' as const },
              { icon: 'calendar', label: 'Événements', route: '/evenements' as const },
              { icon: 'newspaper', label: 'Actualités', route: '/actualites' as const },
              { icon: 'person-circle', label: 'Mon B!', route: '/profil' as const },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.quickCard}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.quickIcon}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={28} color={Colors.primary} />
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prochains événements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>À venir</Text>
            <TouchableOpacity onPress={() => router.push('/evenements')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.map((evt) => (
            <TouchableOpacity
              key={evt.id}
              style={styles.eventCard}
              onPress={() => router.push(`/evenement/${evt.id}` as any)}
            >
              <View style={styles.eventDateBox}>
                <Text style={styles.eventDay}>
                  {new Date(evt.date).getDate()}
                </Text>
                <Text style={styles.eventMonth}>
                  {new Date(evt.date).toLocaleString('fr-FR', { month: 'short' }).toUpperCase()}
                </Text>
              </View>
              <View style={styles.eventInfo}>
                <View style={styles.eventCategoryRow}>
                  <Ionicons name={CATEGORY_ICONS[evt.category] ?? 'star'} size={14} color={Colors.primary} />
                  <Text style={styles.eventCategory}>{evt.category.toUpperCase()}</Text>
                </View>
                <Text style={styles.eventTitle}>{evt.title}</Text>
                <Text style={styles.eventLocation}>
                  <Ionicons name="location-outline" size={12} color={Colors.textSecondary} /> {evt.city}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Halles proches */}
        <View style={[styles.section, { marginBottom: 32 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nos Halles</Text>
            <TouchableOpacity onPress={() => router.push('/halles')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {HALLES.map((h) => (
              <TouchableOpacity
                key={h.id}
                style={styles.halleCard}
                onPress={() => router.push(`/halle/${h.id}` as any)}
              >
                <Image source={{ uri: h.image }} style={styles.halleImage} />
                <View style={styles.halleCardBody}>
                  <Text style={styles.halleName}>{h.name}</Text>
                  <Text style={styles.halleCity}>
                    <Ionicons name="location" size={12} color={Colors.primary} /> {h.city}
                  </Text>
                  <Text style={styles.halleHours}>{h.hours}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  hero: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 40,
  },
  heroTagline: {
    color: Colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 4,
  },
  heroTitleAccent: {
    color: Colors.primaryLight,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
    marginTop: 8,
  },
  heroValues: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  valueTag: {
    borderWidth: 1,
    borderColor: 'rgba(90,139,184,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
  },
  valueText: { color: Colors.primaryLight, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: Colors.navy, letterSpacing: 0.3 },
  seeAll: { fontSize: 12, color: Colors.primary, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.darkBrown,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  quickIcon: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  quickLabel: { fontSize: 13, fontWeight: '800', color: Colors.navy, letterSpacing: 0.3 },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.darkBrown,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  eventDateBox: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 48,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  eventDay: { color: Colors.white, fontSize: 20, fontWeight: '800' },
  eventMonth: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  eventInfo: { flex: 1 },
  eventCategoryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  eventCategory: { fontSize: 9, fontWeight: '800', color: Colors.primary, letterSpacing: 1.5, textTransform: 'uppercase' },
  eventTitle: { fontSize: 15, fontWeight: '700', color: Colors.navy, marginBottom: 2 },
  eventLocation: { fontSize: 12, color: Colors.textSecondary },
  halleCard: {
    width: 190,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.darkBrown,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  halleImage: { width: '100%', height: 115 },
  halleCardBody: { padding: 12 },
  halleName: { fontSize: 13, fontWeight: '800', color: Colors.navy, marginBottom: 3 },
  halleCity: { fontSize: 12, color: Colors.primary, fontWeight: '700', marginBottom: 3 },
  halleHours: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600', letterSpacing: 0.3 },
});
