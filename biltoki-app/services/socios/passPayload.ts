export interface SociosPassPayload {
  v: 1;
  t: string;
  n: string;
  l: string;
  e: string;
}

export function buildSociosPassPayload(token: string, nonce: string, loyaltyId: string, expiresAt: string): string {
  const payload: SociosPassPayload = {
    v: 1,
    t: token,
    n: nonce,
    l: loyaltyId,
    e: expiresAt,
  };

  return JSON.stringify(payload);
}

export function isPassExpired(expiresAt: string): boolean {
  const expiry = Date.parse(expiresAt);
  if (Number.isNaN(expiry)) {
    return true;
  }
  return Date.now() >= expiry;
}

export function secondsUntilExpiry(expiresAt: string): number {
  const expiry = Date.parse(expiresAt);
  if (Number.isNaN(expiry)) {
    return 0;
  }

  const msLeft = expiry - Date.now();
  return Math.max(0, Math.ceil(msLeft / 1000));
}
