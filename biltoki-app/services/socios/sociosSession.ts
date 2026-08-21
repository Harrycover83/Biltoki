import AsyncStorage from '@react-native-async-storage/async-storage';
import { SociosSession } from './contracts';

const DEVICE_ID_KEY = 'socios.deviceId';
const SESSION_KEY = 'socios.session';

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) {
    return existing;
  }

  const deviceId = randomId('DEV');
  await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}

export async function loadSociosSession(): Promise<SociosSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SociosSession;
    if (Date.parse(parsed.expiresAt) <= Date.now()) {
      await AsyncStorage.removeItem(SESSION_KEY);
      return null;
    }

    return parsed;
  } catch {
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function saveSociosSession(session: SociosSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearSociosSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
