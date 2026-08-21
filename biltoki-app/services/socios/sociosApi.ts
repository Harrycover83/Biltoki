import {
  CardResponse,
  EnrollRequest,
  EnrollResponse,
  PassTokenRequest,
  PassTokenResponse,
  SociosSession,
  RequestOtpRequest,
  RequestOtpResponse,
  ScanRedeemRequest,
  ScanRedeemResponse,
  VerifyOtpResponse,
  VerifyOtpRequest,
} from './contracts';

const NETWORK_LATENCY_MS = 450;

let mockCard: CardResponse = {
  loyaltyId: 'SOC-5C-A1-9984',
  holderName: 'MARIE DUPONT',
  phoneMasked: '06 45 22 ** **',
  points: 340,
  tier: 'Membre SOCIOS',
  nextRewardPoints: 450,
  updatedAt: new Date().toISOString(),
};

const usedTokens = new Set<string>();
const otpChallenges = new Map<string, { phone: string; code: string; expiresAt: number }>();
const activeSessionsByPhone = new Map<string, SociosSession>();

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function randomToken(size = 28) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < size; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function randomOtp() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function buildMaskedPhone(phone: string) {
  const digits = normalizePhone(phone);
  return digits.length >= 10
    ? `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ** **`
    : '06 ** ** ** **';
}

function createSession(deviceId: string, phone: string): SociosSession {
  return {
    sessionId: randomId('SES'),
    accessToken: randomToken(32),
    refreshToken: randomToken(40),
    deviceId,
    phone,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60_000).toISOString(),
  };
}

export async function requestOtp(payload: RequestOtpRequest): Promise<RequestOtpResponse> {
  await wait(NETWORK_LATENCY_MS);

  const verificationId = randomId('VER');
  const code = randomOtp();
  const expiresAtMs = Date.now() + 5 * 60_000;

  otpChallenges.set(verificationId, {
    phone: normalizePhone(payload.phone),
    code,
    expiresAt: expiresAtMs,
  });

  // Mock only: in dev, the code can be observed in console while integrating SMS provider.
  console.log('[SOCIOS OTP MOCK]', { verificationId, code });

  return {
    verificationId,
    expiresAt: new Date(expiresAtMs).toISOString(),
    resendAfterSeconds: 30,
  };
}

export async function verifyOtp(payload: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  await wait(NETWORK_LATENCY_MS);

  const challenge = otpChallenges.get(payload.verificationId);
  if (!challenge) {
    throw new Error('Unknown verification challenge');
  }

  if (Date.now() > challenge.expiresAt) {
    otpChallenges.delete(payload.verificationId);
    throw new Error('OTP expired');
  }

  if (challenge.code !== payload.code) {
    throw new Error('OTP invalid');
  }

  const previousSession = activeSessionsByPhone.get(challenge.phone);
  if (previousSession && previousSession.deviceId !== payload.deviceId) {
    activeSessionsByPhone.delete(challenge.phone);
  }

  const session = createSession(payload.deviceId, challenge.phone);
  activeSessionsByPhone.set(challenge.phone, session);
  otpChallenges.delete(payload.verificationId);
  return {
    verified: true,
    phone: challenge.phone,
    phoneMasked: buildMaskedPhone(challenge.phone),
    session,
  };
}

export async function enrollSocios(payload: EnrollRequest): Promise<EnrollResponse> {
  await wait(NETWORK_LATENCY_MS);

  const masked = buildMaskedPhone(payload.phone);

  mockCard = {
    ...mockCard,
    phoneMasked: masked,
    updatedAt: new Date().toISOString(),
  };

  return {
    customerId: randomId('CUS'),
    loyaltyId: mockCard.loyaltyId,
    phoneMasked: mockCard.phoneMasked,
    enrolledAt: new Date().toISOString(),
  };
}

export async function getSociosCard(): Promise<CardResponse> {
  await wait(NETWORK_LATENCY_MS);
  return mockCard;
}

export async function createPassToken(payload: PassTokenRequest): Promise<PassTokenResponse> {
  await wait(250);

  if (payload.loyaltyId !== mockCard.loyaltyId) {
    throw new Error('Unknown loyalty card');
  }

  const expiresAt = new Date(Date.now() + 60_000).toISOString();

  return {
    token: randomToken(),
    nonce: randomId('NONCE'),
    expiresAt,
  };
}

export async function redeemScan(payload: ScanRedeemRequest): Promise<ScanRedeemResponse> {
  await wait(NETWORK_LATENCY_MS);

  if (usedTokens.has(payload.token)) {
    return { accepted: false, reason: 'replay' };
  }

  usedTokens.add(payload.token);
  const pointsDelta = Math.max(1, Math.floor(payload.amountEur));
  const nextBalance = mockCard.points + pointsDelta;

  mockCard = {
    ...mockCard,
    points: nextBalance,
    updatedAt: new Date().toISOString(),
    nextRewardPoints: nextBalance < 450 ? 450 : nextBalance < 700 ? 700 : undefined,
  };

  return {
    accepted: true,
    pointsDelta,
    newBalance: nextBalance,
    eventId: randomId('EVT'),
  };
}
