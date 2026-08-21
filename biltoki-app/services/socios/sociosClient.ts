import {
  CardResponse,
  EnrollRequest,
  EnrollResponse,
  PassTokenRequest,
  PassTokenResponse,
  RequestOtpRequest,
  RequestOtpResponse,
  VerifyOtpResponse,
  VerifyOtpRequest,
} from './contracts';
import {
  createPassToken as mockCreatePassToken,
  enrollSocios as mockEnrollSocios,
  getSociosCard as mockGetSociosCard,
  requestOtp as mockRequestOtp,
  verifyOtp as mockVerifyOtp,
} from './sociosApi';

const USE_MOCK = process.env.EXPO_PUBLIC_SOCIOS_USE_MOCK !== 'false';
const API_BASE_URL = process.env.EXPO_PUBLIC_SOCIOS_API_BASE_URL ?? 'https://api.biltoki.example';
const REQUEST_TIMEOUT_MS = 10_000;

class SociosApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'SociosApiError';
  }
}

async function fetchWithTimeout(input: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function postJson<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new SociosApiError(response.status, `API error ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

async function getJson<TResponse>(path: string): Promise<TResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new SociosApiError(response.status, `API error ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export const sociosClient = {
  async enroll(payload: EnrollRequest): Promise<EnrollResponse> {
    if (USE_MOCK) {
      return mockEnrollSocios(payload);
    }

    return postJson<EnrollResponse, EnrollRequest>('/socios/enroll', payload);
  },

  async getCard(): Promise<CardResponse> {
    if (USE_MOCK) {
      return mockGetSociosCard();
    }

    return getJson<CardResponse>('/socios/card');
  },

  async createPassToken(payload: PassTokenRequest): Promise<PassTokenResponse> {
    if (USE_MOCK) {
      return mockCreatePassToken(payload);
    }

    return postJson<PassTokenResponse, PassTokenRequest>('/socios/pass-token', payload);
  },

  async requestOtp(payload: RequestOtpRequest): Promise<RequestOtpResponse> {
    if (USE_MOCK) {
      return mockRequestOtp(payload);
    }

    return postJson<RequestOtpResponse, RequestOtpRequest>('/socios/request-otp', payload);
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    if (USE_MOCK) {
      return mockVerifyOtp(payload);
    }

    return postJson<VerifyOtpResponse, VerifyOtpRequest>('/socios/verify-otp', payload);
  },
};
