import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const MOCK_USER = {
  name: 'Marie Dupont',
  email: 'marie.dupont@email.com',
  points: 340,
  level: 'Bon Vivant',
  hallesFavorites: ['Halles des 5 Cantons', 'Halle du Haras'],
  memberSince: 'Janvier 2025',
};

const REWARDS = [
  { id: '1', title: 'Verre offert au bar', points: 100, icon: 'wine' as const },
  { id: '2', title: '10% sur vos achats', points: 200, icon: 'pricetag' as const },
  { id: '3', title: 'Place événement gratuite', points: 400, icon: 'ticket' as const },
  { id: '4', title: 'Panier découverte', points: 600, icon: 'basket' as const },
];

export default function ProfilScreen() {
  const [notifs, setNotifs] = useState(true);
  const [geoloc, setGeoloc] = useState(false);

  const progressPercent = Math.min((MOCK_USER.points / 500) * 100, 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Carte membre */}
        <View style={styles.memberCard}>
          <View style={styles.memberCardTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {MOCK_USER.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{MOCK_USER.name}</Text>
              <Text style={styles.memberLevel}>Membre {MOCK_USER.level}</Text>
              <Text style={styles.memberSince}>Depuis {MOCK_USER.memberSince}</Text>
            </View>
            <View style={styles.bLogo}>
              <Text style={styles.bLogoText}>B!</Text>
            </View>
          </View>

          {/* Points & progression */}
          <View style={styles.pointsRow}>
            <View>
              <Text style={styles.pointsLabel}>Points B!</Text>
              <Text style={styles.pointsValue}>{MOCK_USER.points} pts</Text>
            </View>
            <View style={styles.nextLevel}>
              <Text style={styles.nextLevelText}>Prochain palier : 500 pts</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Récompenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes Récompenses</Text>
          <View style={styles.rewardsGrid}>
            {REWARDS.map((r) => {
              const unlocked = MOCK_USER.points >= r.points;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.rewardCard, !unlocked && styles.rewardCardLocked]}
                  onPress={() =>
                    unlocked
                      ? Alert.alert('Récompense', `"${r.title}" activée ! Montrez ce message en caisse.`)
                      : Alert.alert('Pas encore', `Il vous faut ${r.points - MOCK_USER.points} pts de plus.`)
                  }
                >
                  <Ionicons
                    name={unlocked ? r.icon : 'lock-closed'}
                    size={28}
                    color={unlocked ? Colors.primary : Colors.border}
                  />
                  <Text style={[styles.rewardTitle, !unlocked && styles.rewardTitleLocked]}>{r.title}</Text>
                  <Text style={[styles.rewardPoints, !unlocked && styles.rewardPointsLocked]}>
                    {r.points} pts
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Halles favorites */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes Halles</Text>
          {MOCK_USER.hallesFavorites.map((h) => (
            <View key={h} style={styles.halleRow}>
              <Ionicons name="heart" size={16} color={Colors.primary} />
              <Text style={styles.halleRowText}>{h}</Text>
            </View>
          ))}
        </View>

        {/* Paramètres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={20} color={Colors.primary} />
              <Text style={styles.settingLabel}>Notifications push</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, notifs && styles.toggleOn]}
              onPress={() => setNotifs(!notifs)}
            >
              <View style={[styles.toggleThumb, notifs && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.settingLabel}>Géolocalisation</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, geoloc && styles.toggleOn]}
              onPress={() => setGeoloc(!geoloc)}
            >
              <View style={[styles.toggleThumb, geoloc && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Déconnexion */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => Alert.alert('Déconnexion', 'Vous avez été déconnecté.')}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.primary} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 40 },
  memberCard: {
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  memberCardTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontWeight: '800', fontSize: 20 },
  memberName: { color: Colors.white, fontSize: 17, fontWeight: '800' },
  memberLevel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600', marginTop: 2 },
  memberSince: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 1 },
  bLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  bLogoText: { color: Colors.white, fontWeight: '900', fontSize: 18 },
  pointsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  pointsLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },
  pointsValue: { color: Colors.white, fontSize: 26, fontWeight: '800' },
  nextLevel: {},
  nextLevelText: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.navy, marginBottom: 14, letterSpacing: 0.3 },
  rewardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rewardCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.darkBrown,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  rewardCardLocked: { opacity: 0.45 },
  rewardTitle: { fontSize: 12, fontWeight: '800', color: Colors.navy, textAlign: 'center' },
  rewardTitleLocked: { color: Colors.textSecondary },
  rewardPoints: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  rewardPointsLocked: { color: Colors.textSecondary },
  halleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  halleRowText: { fontSize: 14, fontWeight: '700', color: Colors.navy },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: Colors.text },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: Colors.primary },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  toggleThumbOn: { alignSelf: 'flex-end' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
});
