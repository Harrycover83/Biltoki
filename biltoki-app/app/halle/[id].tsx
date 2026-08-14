import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Linking, Alert, SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { HALLES } from '../../data/halles';
import { EVENEMENTS } from '../../data/evenements';

export default function HalleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const halle = HALLES.find((h) => h.id === id);
  const halleEvents = EVENEMENTS.filter((e) => e.halleId === id);

  if (!halle) {
    return (
      <View style={styles.notFound}>
        <Text>Halle introuvable.</Text>
      </View>
    );
  }

  const callHalle = () => Linking.openURL(`tel:${halle.phone.replace(/\s/g, '')}`);
  const openMaps = () => {
    const url = `https://maps.google.com/?q=${halle.latitude},${halle.longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <View style={styles.hero}>
          <Image source={{ uri: halle.image }} style={styles.image} />
          <View style={styles.imageOverlay} />
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>NOS HALLES</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{halle.name}</Text>
              <Text style={styles.city}>
                <Ionicons name="location" size={14} color={Colors.primary} /> {halle.city}
              </Text>
            </View>
            <View style={[styles.pill, { backgroundColor: Colors.secondary + '20' }]}>
              <Ionicons name="time-outline" size={13} color={Colors.secondary} />
              <Text style={[styles.pillText, { color: Colors.secondary }]}>{halle.hours}</Text>
            </View>
          </View>

          <Text style={styles.description}>{halle.description}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={callHalle}>
              <Ionicons name="call" size={20} color={Colors.white} />
              <Text style={styles.actionText}>Appeler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={openMaps}>
              <Ionicons name="navigate" size={20} color={Colors.primary} />
              <Text style={[styles.actionText, { color: Colors.primary }]}>Itinéraire</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBlock}>
            <Ionicons name="map-outline" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>{halle.address}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Les stands</Text>
            <View style={styles.standGrid}>
              {halle.stands.map((stand) => (
                <View key={stand} style={styles.standChip}>
                  <Ionicons name="storefront-outline" size={13} color={Colors.primary} />
                  <Text style={styles.standText}>{stand}</Text>
                </View>
              ))}
            </View>
          </View>

          {halleEvents.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Événements à venir</Text>
              {halleEvents.map((evt) => (
                <TouchableOpacity
                  key={evt.id}
                  style={styles.eventRow}
                  onPress={() => router.push(`/evenement/${evt.id}` as any)}
                >
                  <View style={styles.eventDateBox}>
                    <Text style={styles.eventDay}>{new Date(evt.date).getDate()}</Text>
                    <Text style={styles.eventMonth}>
                      {new Date(evt.date).toLocaleString('fr-FR', { month: 'short' }).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventTitle}>{evt.title}</Text>
                    <Text style={styles.eventTime}>{evt.time}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { position: 'relative' },
  image: { width: '100%', height: 260 },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  headerOverlay: { position: 'absolute', top: 18, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  backBtn: {
    backgroundColor: 'rgba(17,17,17,0.55)',
    borderRadius: 999,
    padding: 8,
  },
  heroBadge: { backgroundColor: Colors.rose, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  heroBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 1.8, textTransform: 'uppercase' },
  body: { padding: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  name: { fontSize: 26, fontWeight: '900', color: Colors.primary, textTransform: 'uppercase', lineHeight: 30 },
  city: { fontSize: 13, color: Colors.rose, fontWeight: '800', marginTop: 6, letterSpacing: 0.8, textTransform: 'uppercase' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4,
  },
  pillText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21, marginBottom: 20 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 13,
    gap: 8,
  },
  actionBtnOutline: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  actionText: { fontSize: 14, fontWeight: '800', color: Colors.white },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: { fontSize: 13, color: Colors.text, flex: 1, fontWeight: '700' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: Colors.primary, marginBottom: 12, letterSpacing: 0.8, textTransform: 'uppercase' },
  standGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  standChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  standText: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventDateBox: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDay: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  eventMonth: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '800' },
  eventTitle: { fontSize: 14, fontWeight: '800', color: Colors.text },
  eventTime: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});
