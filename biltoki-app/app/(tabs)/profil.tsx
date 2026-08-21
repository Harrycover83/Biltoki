import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Alert, TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../../constants/Colors';
import {
  SOCIOS_CARD_MOCK,
  SOCIOS_ONBOARDING_STEPS,
  SOCIOS_REFERENTS,
  SOCIOS_REWARDS,
  SOCIOS_RULES,
} from '../../data/socios';
import { CardResponse, PassTokenResponse, SociosSession } from '../../services/socios/contracts';
import { sociosClient } from '../../services/socios/sociosClient';
import { buildSociosPassPayload, isPassExpired, secondsUntilExpiry } from '../../services/socios/passPayload';
import { clearSociosSession, getOrCreateDeviceId, loadSociosSession, saveSociosSession } from '../../services/socios/sociosSession';

const MOCK_USER = {
  name: 'Marie Dupont',
  email: 'marie.dupont@email.com',
  points: 340,
  eurosSpentAtBar: 340,
  level: 'Membre SOCIOS',
  hallesFavorites: ['Halles des 5 Cantons', 'Halle du Haras'],
  memberSince: 'Janvier 2025',
};

export default function ProfilScreen() {
  const [notifs, setNotifs] = useState(true);
  const [geoloc, setGeoloc] = useState(false);
  const [phone, setPhone] = useState('06 45 22 19 70');
  const [otpCode, setOtpCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);
  const [otpResendAfterSeconds, setOtpResendAfterSeconds] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [session, setSession] = useState<SociosSession | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [card, setCard] = useState<CardResponse | null>(null);
  const [isCardLoading, setIsCardLoading] = useState(true);
  const [isOtpRequestLoading, setIsOtpRequestLoading] = useState(false);
  const [isOtpVerifyLoading, setIsOtpVerifyLoading] = useState(false);
  const [isPassLoading, setIsPassLoading] = useState(false);
  const [passModalVisible, setPassModalVisible] = useState(false);
  const [passTokenData, setPassTokenData] = useState<PassTokenResponse | null>(null);
  const [passTimeLeft, setPassTimeLeft] = useState(0);

  const points = card?.points ?? MOCK_USER.points;
  const nextReward = SOCIOS_REWARDS.find((reward) => reward.points > points);
  const maxRewardPoints = SOCIOS_REWARDS[SOCIOS_REWARDS.length - 1].points;
  const progressPercent = Math.min((points / maxRewardPoints) * 100, 100);
  const pointsToNext = nextReward ? nextReward.points - points : 0;
  const isJoined = Boolean(session);

  const phoneDigits = phone.replace(/\D/g, '');
  const maskedPhone = phoneDigits.length >= 10
    ? `${phoneDigits.slice(0, 2)} ${phoneDigits.slice(2, 4)} ${phoneDigits.slice(4, 6)} ** **`
    : 'Numero non renseigne';

  const walletCard = useMemo(() => ({
    ...SOCIOS_CARD_MOCK,
    id: card?.loyaltyId ?? SOCIOS_CARD_MOCK.id,
    holderName: card?.holderName ?? SOCIOS_CARD_MOCK.holderName,
    phoneMasked: card?.phoneMasked ?? SOCIOS_CARD_MOCK.phoneMasked,
  }), [card]);

  const passPayload = useMemo(() => {
    if (!passTokenData || !card?.loyaltyId || isPassExpired(passTokenData.expiresAt)) {
      return null;
    }

    return buildSociosPassPayload(
      passTokenData.token,
      passTokenData.nonce,
      card.loyaltyId,
      passTokenData.expiresAt
    );
  }, [card?.loyaltyId, passTokenData]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedSession = await loadSociosSession();
        if (storedSession) {
          setSession(storedSession);
          setPhone(storedSession.phone);
        }
      } finally {
        setIsRestoringSession(false);
      }
    };

    void restoreSession();
  }, []);

  useEffect(() => {
    const loadCard = async () => {
      try {
        const cardData = await sociosClient.getCard();
        setCard(cardData);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger la carte SOCIOS pour le moment.');
      } finally {
        setIsCardLoading(false);
      }
    };

    void loadCard();
  }, []);

  useEffect(() => {
    if (!passModalVisible || !passTokenData) {
      return;
    }

    const interval = setInterval(() => {
      const diff = secondsUntilExpiry(passTokenData.expiresAt);
      setPassTimeLeft(diff);

      if (diff === 0) {
        setPassTokenData(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [passModalVisible, passTokenData]);

  useEffect(() => {
    if (!otpExpiresAt) {
      return;
    }

    const interval = setInterval(() => {
      const remaining = secondsUntilExpiry(otpExpiresAt);
      if (remaining === 0) {
        setOtpSent(false);
        setVerificationId(null);
        setOtpExpiresAt(null);
        setOtpCode('');
        setOtpResendAfterSeconds(0);
      }

      setOtpResendAfterSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpExpiresAt]);

  const handleRequestOtp = async () => {
    if (phoneDigits.length < 10) {
      Alert.alert('Numero invalide', 'Merci de saisir un numero de telephone valide.');
      return;
    }

    try {
      setIsOtpRequestLoading(true);
      const otp = await sociosClient.requestOtp({ phone, purpose: 'enroll' });
      setVerificationId(otp.verificationId);
      setOtpExpiresAt(otp.expiresAt);
      setOtpResendAfterSeconds(otp.resendAfterSeconds);
      setOtpSent(true);
      Alert.alert('Code envoyé', 'Un code de vérification a été envoyé par SMS.');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d’envoyer le code de vérification.');
    } finally {
      setIsOtpRequestLoading(false);
    }
  };

  const handleVerifyOtpAndEnroll = async () => {
    if (!verificationId || otpCode.replace(/\D/g, '').length !== 6) {
      Alert.alert('Code invalide', 'Merci de saisir le code à 6 chiffres reçu par SMS.');
      return;
    }

    try {
      setIsOtpVerifyLoading(true);
      const deviceId = await getOrCreateDeviceId();
      const result = await sociosClient.verifyOtp({ verificationId, code: otpCode.replace(/\D/g, ''), deviceId });
      await sociosClient.enroll({ phone: result.phone });
      await saveSociosSession(result.session);
      setSession(result.session);
      setPhone(result.session.phone);
      const cardData = await sociosClient.getCard();
      setCard(cardData);
      setOtpSent(false);
      setVerificationId(null);
      setOtpExpiresAt(null);
      setOtpCode('');
      Alert.alert('Compte activé', 'Votre numéro a été vérifié et le compte SOCIOS est actif.');
    } catch (error) {
      Alert.alert('Erreur', 'Le code est invalide ou expiré.');
    } finally {
      setIsOtpVerifyLoading(false);
    }
  };

  const handleAddToWallet = () => {
    Alert.alert(
      'Bientot disponible',
      'La carte Wallet sera activee avec la liaison iOS/Android Wallet et la signature des passes.'
    );
  };

  const handleNfcTap = () => {
    Alert.alert(
      'NFC en preparation',
      'Le mode sans contact sera active apres integration native NFC et configuration des caisses.'
    );
  };

  const handleGeneratePass = async () => {
    if (!card?.loyaltyId) {
      Alert.alert('Carte indisponible', 'La carte SOCIOS est en cours de chargement.');
      return;
    }

    try {
      setIsPassLoading(true);
      const tokenData = await sociosClient.createPassToken({ loyaltyId: card.loyaltyId });
      setPassTokenData(tokenData);
      setPassTimeLeft(secondsUntilExpiry(tokenData.expiresAt));
      setPassModalVisible(true);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de generer le pass caisse.');
    } finally {
      setIsPassLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearSociosSession();
    setSession(null);
    setOtpSent(false);
    setVerificationId(null);
    setOtpExpiresAt(null);
    setOtpCode('');
    Alert.alert('Déconnexion', 'La session a été supprimée de cet appareil.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.memberCard}>
          <View style={styles.memberTopLine}>
            <Text style={styles.memberEyebrow}>{SOCIOS_RULES.programName}</Text>
            <View style={styles.bLogo}>
              <Text style={styles.bLogoText}>S!</Text>
            </View>
          </View>

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
          </View>

          <Text style={styles.ruleText}>{SOCIOS_RULES.conversionLabel}</Text>
          <Text style={styles.ruleSubtext}>{SOCIOS_RULES.iPadLabel} Pour créer un compte, il faut d’abord confirmer le numéro par SMS.</Text>
          <Text style={styles.ruleSubtext}>La session est ensuite liée à cet appareil. Si le même compte se connecte sur un autre téléphone, l’ancienne session est révoquée côté serveur.</Text>

          <View style={styles.phoneRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.phoneLabel}>Numero de telephone</Text>
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="06 00 00 00 00"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
            <TouchableOpacity
              style={[styles.joinButton, isOtpRequestLoading && styles.disabledBtn]}
              onPress={handleRequestOtp}
              disabled={isOtpRequestLoading}
            >
              <Text style={styles.joinButtonText}>{isOtpRequestLoading ? 'Envoi...' : otpSent ? 'Renvoyer le code' : 'Recevoir le code'}</Text>
            </TouchableOpacity>
          </View>

          {otpSent ? (
            <View style={styles.otpCard}>
              <Text style={styles.otpTitle}>Validation du numéro</Text>
              <Text style={styles.otpSubtitle}>Saisis le code reçu par SMS pour activer le compte.</Text>
              <TextInput
                style={styles.otpInput}
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="123456"
                placeholderTextColor={Colors.textSecondary}
              />
              <TouchableOpacity
                style={[styles.otpVerifyButton, isOtpVerifyLoading && styles.disabledBtn]}
                onPress={handleVerifyOtpAndEnroll}
                disabled={isOtpVerifyLoading}
              >
                <Text style={styles.otpVerifyButtonText}>{isOtpVerifyLoading ? 'Verification...' : 'Verifier et activer'}</Text>
              </TouchableOpacity>
              <Text style={styles.otpHint}>
                {otpExpiresAt ? `Code valable encore ${secondsUntilExpiry(otpExpiresAt)}s` : ''}
              </Text>
              <Text style={styles.otpHint}>
                {otpResendAfterSeconds > 0 ? `Renvoyer disponible dans ${otpResendAfterSeconds}s` : 'Tu peux demander un nouveau code si besoin.'}
              </Text>
            </View>
          ) : null}

          <View style={styles.statusRow}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
            <Text style={styles.statusText}>
              Compte associe: {isRestoringSession ? 'Restauration de la session...' : isJoined ? `${session?.phone ?? maskedPhone} · appareil ${session?.deviceId ?? 'local'}` : 'Non active'}
            </Text>
          </View>

          <View style={styles.pointsRow}>
            <View>
              <Text style={styles.pointsLabel}>Points SOCIOS</Text>
              <Text style={styles.pointsValue}>{points} pts</Text>
            </View>
            <View style={styles.nextLevel}>
              <Text style={styles.nextLevelText}>
                {nextReward
                  ? `Prochain palier: ${nextReward.points} pts (${pointsToNext} restants)`
                  : 'Tous les paliers sont debloques'}
              </Text>
            </View>
          </View>

          <Text style={styles.eurosValue}>{MOCK_USER.eurosSpentAtBar} euros cumules au bar</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carte Socios</Text>

          <View style={styles.walletCard}>
            <View style={styles.walletGlowLeft} />
            <View style={styles.walletGlowRight} />

            <View style={styles.walletTopRow}>
              <Text style={styles.walletBrand}>SOCIOS</Text>
              <View style={styles.walletNfcBadge}>
                <Ionicons name="wifi-outline" size={12} color={Colors.white} />
                <Text style={styles.walletNfcBadgeText}>NFC</Text>
              </View>
            </View>

            <Text style={styles.walletId}>{walletCard.id}</Text>

            <View style={styles.walletBottomRow}>
              <View>
                <Text style={styles.walletLabel}>Titulaire</Text>
                <Text style={styles.walletValue}>{walletCard.holderName}</Text>
              </View>
              <View>
                <Text style={styles.walletLabel}>Numero</Text>
                <Text style={styles.walletValue}>{walletCard.phoneMasked}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.presentPassBtn, (isPassLoading || isCardLoading) && styles.disabledBtn]}
            onPress={handleGeneratePass}
            disabled={isPassLoading || isCardLoading}
          >
            <Ionicons name="qr-code-outline" size={17} color={Colors.white} />
            <Text style={styles.presentPassBtnText}>{isPassLoading ? 'Generation...' : 'Presenter en caisse'}</Text>
          </TouchableOpacity>

          <View style={styles.walletActionsRow}>
            <TouchableOpacity style={styles.walletPrimaryAction} onPress={handleAddToWallet}>
              <Ionicons name="wallet-outline" size={16} color={Colors.white} />
              <Text style={styles.walletPrimaryActionText}>Ajouter a Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.walletSecondaryAction} onPress={handleNfcTap}>
              <Ionicons name="phone-portrait-outline" size={16} color={Colors.primary} />
              <Text style={styles.walletSecondaryActionText}>Scanner NFC</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.walletInfoRow}>
            <Ionicons name="information-circle-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.walletInfoText}>{walletCard.nfcLabel}{isCardLoading ? ' · chargement...' : ''}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comment ca marche</Text>
          <View style={styles.stepsCard}>
            {SOCIOS_ONBOARDING_STEPS.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepIndexCircle}>
                  <Text style={styles.stepIndexText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.trainingText}>{SOCIOS_RULES.nextTrainingLabel}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recompenses SOCIOS</Text>
          <View style={styles.rewardsGrid}>
            {SOCIOS_REWARDS.map((reward) => {
              const unlocked = points >= reward.points;
              return (
                <TouchableOpacity
                  key={reward.id}
                  style={[styles.rewardCard, !unlocked && styles.rewardCardLocked]}
                  onPress={() =>
                    unlocked
                      ? Alert.alert('Recompense activee', `${reward.title} est disponible. Montrez ce message en caisse.`)
                      : Alert.alert('Pas encore', `Il vous faut ${reward.points - points} pts de plus.`)
                  }
                >
                  <Ionicons
                    name={unlocked ? reward.icon : 'lock-closed'}
                    size={28}
                    color={unlocked ? Colors.primary : Colors.border}
                  />
                  <Text style={[styles.rewardTitle, !unlocked && styles.rewardTitleLocked]}>{reward.title}</Text>
                  <Text style={[styles.rewardDescription, !unlocked && styles.rewardTitleLocked]}>{reward.description}</Text>
                  <Text style={[styles.rewardPoints, !unlocked && styles.rewardPointsLocked]}>
                    {reward.points} pts
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referents SOCIOS</Text>
          <View style={styles.referentsCard}>
            {SOCIOS_REFERENTS.map((entry) => (
              <View key={entry.city} style={styles.referentRow}>
                <Text style={styles.referentCity}>{entry.city}</Text>
                <Text style={styles.referentName}>{entry.referents}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes halles</Text>
          {MOCK_USER.hallesFavorites.map((h) => (
            <View key={h} style={styles.halleRow}>
              <Ionicons name="heart" size={16} color={Colors.primary} />
              <Text style={styles.halleRowText}>{h}</Text>
            </View>
          ))}
        </View>

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

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.primary} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={passModalVisible} transparent animationType="slide" onRequestClose={() => setPassModalVisible(false)}>
        <View style={styles.passModalBackdrop}>
          <View style={styles.passModalCard}>
            <View style={styles.passModalHeader}>
              <Text style={styles.passModalTitle}>Pass Caisse SOCIOS</Text>
              <TouchableOpacity onPress={() => {
                setPassModalVisible(false);
                setPassTokenData(null);
              }}>
                <Ionicons name="close" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.passModalSubtitle}>Montrez ce code au bar. Il expire rapidement pour eviter la fraude.</Text>

            <View style={styles.passQrCard}>
              {passPayload ? (
                <QRCode value={passPayload} size={170} />
              ) : (
                <View style={styles.passQrFallback}>
                  <Ionicons name="warning-outline" size={22} color={Colors.rose} />
                  <Text style={styles.passQrFallbackText}>Pass expire. Regenerer un nouveau code.</Text>
                </View>
              )}
            </View>

            <View style={styles.passTokenBox}>
              <Text style={styles.passTokenText}>
                {passTokenData?.token.match(/.{1,4}/g)?.join(' ') ?? 'TOKEN EXPIRE'}
              </Text>
            </View>

            <View style={styles.passMetaRow}>
              <Ionicons name="time-outline" size={16} color={passTimeLeft > 10 ? Colors.secondary : Colors.rose} />
              <Text style={[styles.passMetaText, passTimeLeft <= 10 && { color: Colors.rose }]}>Expire dans {passTimeLeft}s</Text>
            </View>

            <TouchableOpacity
              style={[styles.passRefreshBtn, isPassLoading && styles.disabledBtn]}
              onPress={handleGeneratePass}
              disabled={isPassLoading}
            >
              <Ionicons name="refresh" size={15} color={Colors.primary} />
              <Text style={styles.passRefreshText}>Regenerer un pass</Text>
            </TouchableOpacity>

            {isPassLoading ? <ActivityIndicator style={styles.passLoadingIndicator} color={Colors.primary} /> : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 40 },
  memberCard: {
    backgroundColor: Colors.card,
    borderRadius: 26,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  memberTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  memberEyebrow: { fontSize: 11, fontWeight: '900', color: Colors.textSecondary, letterSpacing: 2.2, textTransform: 'uppercase' },
  memberCardTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontWeight: '800', fontSize: 20 },
  memberName: { color: Colors.primary, fontSize: 17, fontWeight: '900', textTransform: 'uppercase' },
  memberLevel: { color: Colors.secondary, fontSize: 13, fontWeight: '800', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.6 },
  memberSince: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  ruleText: { color: Colors.primary, fontSize: 13, fontWeight: '900', textTransform: 'uppercase', marginBottom: 4 },
  ruleSubtext: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18, marginBottom: 14 },
  bLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bLogoText: { color: Colors.white, fontWeight: '900', fontSize: 18 },
  phoneRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 10 },
  phoneLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  phoneInput: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.paper,
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  disabledBtn: { opacity: 0.55 },
  joinButtonText: { color: Colors.white, fontWeight: '900', fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  statusText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  pointsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  pointsLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.1 },
  pointsValue: { color: Colors.primary, fontSize: 28, fontWeight: '900' },
  nextLevel: {},
  nextLevelText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  eurosValue: { color: Colors.secondary, fontSize: 12, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 },
  progressBar: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: Colors.primary, marginBottom: 14, letterSpacing: 0.8, textTransform: 'uppercase' },
  walletCard: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  walletGlowLeft: {
    position: 'absolute',
    top: -18,
    left: -18,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2E6B4F',
    opacity: 0.35,
  },
  walletGlowRight: {
    position: 'absolute',
    bottom: -26,
    right: -12,
    width: 115,
    height: 115,
    borderRadius: 58,
    backgroundColor: '#E75E7B',
    opacity: 0.28,
  },
  walletTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletBrand: { color: Colors.white, fontSize: 12, fontWeight: '900', letterSpacing: 2.2, textTransform: 'uppercase' },
  walletNfcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  walletNfcBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  walletId: { color: Colors.white, fontSize: 24, fontWeight: '900', marginTop: 18, letterSpacing: 1.2 },
  walletBottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  walletLabel: { color: 'rgba(255,255,255,0.74)', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.3 },
  walletValue: { color: Colors.white, fontSize: 12, fontWeight: '900', marginTop: 4, letterSpacing: 0.8 },
  presentPassBtn: {
    marginTop: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  presentPassBtnText: { color: Colors.white, fontSize: 11, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
  walletActionsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  walletPrimaryAction: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  walletPrimaryActionText: { color: Colors.white, fontSize: 11, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  walletSecondaryAction: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: Colors.card,
  },
  walletSecondaryActionText: { color: Colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  walletInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  walletInfoText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  stepsCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 12,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepIndexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  stepIndexText: { color: Colors.white, fontWeight: '900', fontSize: 12 },
  stepText: { flex: 1, color: Colors.text, fontSize: 13, lineHeight: 19, fontWeight: '700' },
  trainingText: { marginTop: 10, color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  rewardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rewardCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rewardCardLocked: { opacity: 0.45 },
  rewardTitle: { fontSize: 12, fontWeight: '900', color: Colors.primary, textAlign: 'center', textTransform: 'uppercase' },
  rewardDescription: { fontSize: 11, lineHeight: 16, color: Colors.textSecondary, textAlign: 'center' },
  rewardTitleLocked: { color: Colors.textSecondary },
  rewardPoints: { fontSize: 11, fontWeight: '900', color: Colors.secondary },
  rewardPointsLocked: { color: Colors.textSecondary },
  referentsCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  referentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  referentCity: { color: Colors.primary, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  referentName: { color: Colors.textSecondary, fontSize: 13, fontWeight: '700' },
  halleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  halleRowText: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 15, fontWeight: '700', color: Colors.text },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 999,
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
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  passModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  passModalCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  passModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  passModalTitle: { fontSize: 18, fontWeight: '900', color: Colors.primary, textTransform: 'uppercase' },
  passModalSubtitle: { marginTop: 8, color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  passQrCard: {
    marginTop: 14,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passQrFallback: { alignItems: 'center', gap: 8 },
  passQrFallbackText: { color: Colors.rose, fontSize: 12, textAlign: 'center', fontWeight: '700' },
  passTokenBox: {
    marginTop: 14,
    backgroundColor: Colors.paper,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  passTokenText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  passMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  passMetaText: { color: Colors.secondary, fontSize: 12, fontWeight: '800' },
  passRefreshBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  passRefreshText: { color: Colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  passLoadingIndicator: { marginTop: 10 },
});
