export const SOCIOS_API = {
  enroll: '/socios/enroll',
  card: '/socios/card',
  passToken: '/socios/pass-token',
  scanRedeem: '/socios/scan-redeem',
} as const;

export interface EnrollRequest {
  phone: string;
  hallId?: string;
  consentMarketing?: boolean;
}

export interface EnrollResponse {
  customerId: string;
  loyaltyId: string;
  phoneMasked: string;
  enrolledAt: string;
}

export interface CardResponse {
  loyaltyId: string;
  holderName: string;
  phoneMasked: string;
  points: number;
  tier: string;
  nextRewardPoints?: number;
  updatedAt: string;
}

export interface PassTokenRequest {
  loyaltyId: string;
}

export interface PassTokenResponse {
  token: string;
  expiresAt: string;
  nonce: string;
}

export interface ScanRedeemRequest {
  token: string;
  ticketId: string;
  terminalId: string;
  hallId: string;
  amountEur: number;
}

export interface ScanRedeemResponse {
  accepted: boolean;
  reason?: 'expired' | 'replay' | 'invalid' | 'network';
  pointsDelta?: number;
  newBalance?: number;
  eventId?: string;
}
