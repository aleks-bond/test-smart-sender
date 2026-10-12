import { request } from '@/api/client';
import { markSessionStarted } from '@/api/session-recovery';
import { getFingerprint } from '@/lib/fingerprint';
import { deviceTokenStore } from '@/lib/device-token';
import type { LoginCredentials, LoginResponse, User } from './auth.types';

const CAPTCHA_TOKEN = 'mock-captcha-token';

export const authApi = {
  login: (c: LoginCredentials) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { ...c, fingerprint: getFingerprint() },
      headers: { 'X-Captcha-Token': CAPTCHA_TOKEN },
      recoverSession: false,
    }),
  issue: (device_session_token: string) =>
    request<void>('/auth/token/issue', {
      method: 'POST',
      body: { device_session_token, fingerprint: getFingerprint() },
      recoverSession: false,
    }),
  revoke: () =>
    request<void>('/auth/token/revoke', {
      method: 'POST',
      body: { fingerprint: getFingerprint() },
      recoverSession: false,
    }),
  me: (opts: { recoverSession?: boolean } = {}) => request<User>('/v1/me', opts),
};

export async function signIn(credentials: LoginCredentials): Promise<User> {
  const { device_session_token } = await authApi.login(credentials);
  deviceTokenStore.set(device_session_token);
  // device token is single use
  try {
    await authApi.issue(device_session_token);
  } finally {
    deviceTokenStore.clear();
  }
  markSessionStarted();
  return authApi.me();
}
