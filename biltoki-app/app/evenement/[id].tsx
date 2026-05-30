import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { EVENEMENTS } from '../../data/evenements';

const CATEGORY_COLORS: Record<string, string> = {
  concert: '#8B5CF6',
  tapas: '#EF4444',
  banquet: '#F59E0B',
  atelier: '#10B981',
  marché: '#3B82F6',
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  concert: 'musical-notes',
  tapas: 'restaurant',
  banquet: 'people',
  atelier: 'school',
  marché: 'basket',
};

export default function EvenementDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const event = EVENEMENTS.find((e) => e.id === id);
  const [inscrit, setInscrit] = useState(false);

  if (!event) {
    return (
      <View style={styles.notFound}>
        <Text>Événement introuvable.</Text>
      </View>
    );
  }

  const color = CATEGORY_COLORS[event.category] ?? Colors.primary;
  const icon = CATEGORY_ICONS[event.category] ?? 'star';
  const dateObj = new Date(event.date);
  const dateFormatted = dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleInscription = () => {
    if (inscrit) {
      Alert.alert('Annuler ?', 'Voulez-vous annuler votre participation ?', [
        { text: 'Non' },
        { text: 'Oui', onPress: () => setInscrit(false) },
      ]);
    } else {
      setInscrit(true);
      Alert.alert(
        'Inscription confirmée !',
        `Vous êtes inscrit pour "${event.title}". Un rappel vous sera envoyé la veille.`,
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        {/* Banner coloré */}
        <View style={[styles.banner, { backgroundColor: color }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIcon}>
              <Ionicons name={icon} size={36} color={Colors.white} />
            </View>
            <Text style={styles.bannerCategory}>{event.category.toUpperCase()}</Text>
            <Text style={styles.bannerTitle}>{event.title}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Fiche date/lieu */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={18} color={color} />
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{dateFormatted}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="time" size={18} color={color} />
              <Text style={styles.infoLabel}>Heure</Text>
              <Text style={styles.infoValue}>{event.time}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="storefront" size={18} color={color} />
              <Text style={styles.infoLabel}>Lieu</Text>
              <Text style={styles.infoValue}>{event.halleName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="location" size={18} color={color} />
              <Text style={styles.infoLabel}>Ville</Text>
              <Text style={styles.infoValue}>{event.city}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Points B! */}
          <View style={[styles.pointsCard, { borderColor: color + '40' }]}>
            <Ionicons name="star" size={22} color={color} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pointsTitle}>Gagnez des points B!</Text>
              <Text style={styles.pointsSub}>Participez et cumulez 50 pts sur votre carte communauté.</Text>
            </View>
          </View>

          {/* CTA Inscription */}
          <TouchableOpacity
            style={[styles.ctaBtn, inscrit && styles.ctaBtnActive, { backgroundColor: inscrit ? Colors.secondary : color }]}
            onPress={handleInscription}
          >
            <Ionicons
              name={inscrit ? 'checkmark-circle' : 'add-circle'}
              size={22}
              color={Colors.white}
            />
            <Text style={styles.ctaText}>
              {inscrit ? 'Inscrit — Annuler' : 'Je participe'}
            </Text>
          </TouchableOpacity>

          {/* Voir la halle */}
          <TouchableOpacity
            style={styles.halleLink}
            onPress={() => router.push(`/halle/${event.halleId}` as any)}
          >
            <Ionicons name="storefront-outline" size={16} color={Colors.primary} />
            <Text style={styles.halleLinkText}>Voir la halle {event.halleName}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  banner: { paddingTop: 50, paddingBottom: 40, paddingHorizontal: 20 },
  backBtn: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    padding: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  bannerContent: { alignItems: 'center', gap: 10 },
  bannerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerCategory: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  bannerTitle: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
  },
  body: { padding: 20 },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.darkBrown,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  infoLabel: { fontSize: 12, color: Colors.textSecondary, width: 52, fontWeight: '700', letterSpacing: 0.5 },
  infoValue: { flex: 1, fontSize: 13, fontWeight: '800', color: Colors.navy },
  divider: { height: 1, backgroundColor: Colors.border },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.navy, marginBottom: 8, letterSpacing: 0.3 },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  pointsTitle: { fontSize: 14, fontWeight: '800', color: Colors.navy },
  pointsSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
    marginBottom: 14,
  },
  ctaBtnActive: {},
  ctaText: { color: Colors.white, fontSize: 17, fontWeight: '800' },
  halleLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  halleLinkText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
});
