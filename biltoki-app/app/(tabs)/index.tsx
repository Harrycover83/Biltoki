import React from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  Image, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { EVENEMENTS } from '../../data/evenements';
import { HALLES } from '../../data/halles';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  concert: 'musical-notes',
  tapas: 'restaurant',
  banquet: 'people',
  atelier: 'school',
  marché: 'basket',
};

const HERO_IMAGE = 'https://cdn.prod.website-files.com/69032f7aa92da3854968dc83/69e87b739d2efaae7a8aaee1_Couleurs_halles%20bonne%20vivante.png';
const COMMUNITY_IMAGE = 'https://cdn.prod.website-files.com/69032f7aa92da3854968dc83/696e3cafa9e2a1a432f45c9d_biltoki_jo_tokyo_1-p-800.jpg';

export default function HomeScreen() {
  const router = useRouter();
  const upcomingEvents = EVENEMENTS.slice(0, 3);
  const featuredHalles = HALLES.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTag}>LA PLACE DES BONS VIVANTS</Text>
          <Text style={styles.heroTitle}>BILTOKI{`\n`}en ville.</Text>
          <Text style={styles.heroSub}>
            Des halles gourmandes, des tables à partager, des événements toute l’année.
          </Text>

          <View style={styles.heroChips}>
            {['PARTAGE', 'CONVIVIALITÉ', 'AUTHENTICITÉ'].map((item, index) => (
              <View
                key={item}
                style={[
                  styles.heroChip,
                  index === 0 && styles.heroChipRose,
                  index === 1 && styles.heroChipOrange,
                  index === 2 && styles.heroChipGreen,
                ]}
              >
                <Text style={styles.heroChipText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.heroVisual}>
            <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="contain" />
            <View style={styles.heroVisualCaption}>
              <Text style={styles.heroVisualTitle}>Couleurs des halles</Text>
              <Text style={styles.heroVisualText}>Une ambiance vivante, populaire et généreuse.</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>EXPLORER</Text>
          </View>
          <View style={styles.quickGrid}>
            {[
              { icon: 'storefront-outline', label: 'Nos Halles', route: '/halles' as const, tone: 'rose' },
              { icon: 'calendar-outline', label: 'Événements', route: '/evenements' as const, tone: 'orange' },
              { icon: 'newspaper-outline', label: 'Actualités', route: '/actualites' as const, tone: 'green' },
              { icon: 'flame-outline', label: 'SOCIOS!', route: '/profil' as const, tone: 'orange' },
              { icon: 'person-outline', label: 'Mon B!', route: '/profil' as const, tone: 'blue' },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={styles.quickCard} onPress={() => router.push(item.route)}>
                <View style={[styles.quickIcon, item.tone === 'rose' && styles.quickIconRose, item.tone === 'orange' && styles.quickIconOrange, item.tone === 'green' && styles.quickIconGreen, item.tone === 'blue' && styles.quickIconBlue]}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={22} color={Colors.primary} />
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>À VENIR</Text>
            <TouchableOpacity onPress={() => router.push('/evenements')}>
              <Text style={styles.sectionLink}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          {upcomingEvents.map((evt, index) => {
            const dateObj = new Date(evt.date);
            const tone = index % 3 === 0 ? Colors.rose : index % 3 === 1 ? Colors.orange : Colors.secondary;

            return (
              <TouchableOpacity key={evt.id} style={styles.eventCard} onPress={() => router.push(`/evenement/${evt.id}` as any)}>
                <View style={[styles.eventDateBox, { backgroundColor: tone }]}>
                  <Text style={styles.eventDay}>{dateObj.getDate()}</Text>
                  <Text style={styles.eventMonth}>{dateObj.toLocaleString('fr-FR', { month: 'short' }).toUpperCase()}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <View style={styles.eventCategoryRow}>
                    <Ionicons name={CATEGORY_ICONS[evt.category] ?? 'star-outline'} size={13} color={tone} />
                    <Text style={[styles.eventCategory, { color: tone }]}>{evt.category.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{evt.title}</Text>
                  <Text style={styles.eventMeta}>{evt.halleName} · {evt.city}</Text>
                  <Text style={styles.eventMeta}>{evt.time}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>NOS HALLES</Text>
            <TouchableOpacity onPress={() => router.push('/halles')}>
              <Text style={styles.sectionLink}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hallesRow}>
            {featuredHalles.map((h, index) => (
              <TouchableOpacity key={h.id} style={styles.halleCard} onPress={() => router.push(`/halle/${h.id}` as any)}>
                <Image source={{ uri: h.image }} style={styles.halleImage} />
                <View style={styles.halleBody}>
                  <View style={[styles.halleBadge, index === 0 && styles.halleBadgeRose, index === 1 && styles.halleBadgeOrange, index === 2 && styles.halleBadgeGreen]}>
                    <Text style={styles.halleBadgeText}>{h.city.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.halleName}>{h.name}</Text>
                  <Text style={styles.halleDescription} numberOfLines={2}>{h.description}</Text>
                  <Text style={styles.halleHours}>{h.hours}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.communityCard}>
            <Image source={{ uri: COMMUNITY_IMAGE }} style={styles.communityImage} />
            <View style={styles.communityBody}>
              <Text style={styles.communityEyebrow}>COMMUNAUTÉ B!</Text>
              <Text style={styles.communityTitle}>On vient une fois. Puis on revient.</Text>
              <Text style={styles.communityText}>
                Les visages deviennent familiers, les liens se créent et les habitudes s’installent.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 24 },
  hero: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
  },
  heroTag: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.textSecondary,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 38,
    lineHeight: 40,
    fontWeight: '900',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: -0.6,
  },
  heroSub: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.textSecondary,
    maxWidth: 320,
  },
  heroChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  heroChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroChipRose: { backgroundColor: Colors.rose },
  heroChipOrange: { backgroundColor: Colors.orange },
  heroChipGreen: { backgroundColor: Colors.secondary },
  heroChipText: { color: Colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  heroVisual: {
    marginTop: 18,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroImage: { width: '100%', height: 190, backgroundColor: Colors.card },
  heroVisualCaption: { padding: 16 },
  heroVisualTitle: { fontSize: 16, fontWeight: '900', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 1.1 },
  heroVisualText: { marginTop: 6, fontSize: 13, lineHeight: 19, color: Colors.textSecondary },
  section: { paddingHorizontal: 18, marginTop: 26 },
  sectionHeader: { marginBottom: 12 },
  sectionEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 2.2, color: Colors.textSecondary, textTransform: 'uppercase' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: Colors.primary, letterSpacing: 0.8, textTransform: 'uppercase' },
  sectionLink: { fontSize: 12, color: Colors.primary, fontWeight: '900', letterSpacing: 1.6, textTransform: 'uppercase' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: {
    width: '31.5%',
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: Colors.lightGray,
  },
  quickIconRose: { backgroundColor: '#F8D9E1' },
  quickIconOrange: { backgroundColor: '#F9DAB6' },
  quickIconGreen: { backgroundColor: '#D8E9DF' },
  quickIconBlue: { backgroundColor: '#D9E8F1' },
  quickLabel: { fontSize: 12, fontWeight: '900', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.6 },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventDateBox: {
    width: 58,
    height: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  eventDay: { color: Colors.white, fontSize: 20, fontWeight: '900' },
  eventMonth: { color: 'rgba(255,255,255,0.88)', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  eventInfo: { flex: 1 },
  eventCategoryRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  eventCategory: { fontSize: 10, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase' },
  eventTitle: { fontSize: 15, fontWeight: '900', color: Colors.primary, marginBottom: 4 },
  eventMeta: { fontSize: 12, lineHeight: 16, color: Colors.textSecondary },
  hallesRow: { gap: 12, paddingRight: 6 },
  halleCard: {
    width: 230,
    backgroundColor: Colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  halleImage: { width: '100%', height: 130 },
  halleBody: { padding: 14 },
  halleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  halleBadgeRose: { backgroundColor: Colors.rose },
  halleBadgeOrange: { backgroundColor: Colors.orange },
  halleBadgeGreen: { backgroundColor: Colors.secondary },
  halleBadgeText: { color: Colors.white, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  halleName: { fontSize: 17, fontWeight: '900', color: Colors.primary, textTransform: 'uppercase', lineHeight: 21 },
  halleDescription: { marginTop: 6, fontSize: 13, lineHeight: 19, color: Colors.textSecondary },
  halleHours: { marginTop: 10, fontSize: 11, fontWeight: '900', color: Colors.secondary, letterSpacing: 1.2, textTransform: 'uppercase' },
  communityCard: {
    backgroundColor: Colors.card,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  communityImage: { width: '100%', height: 200 },
  communityBody: { padding: 16 },
  communityEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 2.2, textTransform: 'uppercase', color: Colors.textSecondary },
  communityTitle: { marginTop: 8, fontSize: 22, lineHeight: 28, fontWeight: '900', color: Colors.primary },
  communityText: { marginTop: 8, fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
});
