// sessions last 30s, rotate extends by 30s
export const SESSION_TTL_MS = 30_000;

interface SessionState {
  fingerprint: string;
  expiresAt: number;
}

const pendingDeviceTokens = new Map<string, string>();
let session: SessionState | null = null;

export function createDeviceToken(fingerprint: string): string {
  const token = `dst_${crypto.randomUUID().replace(/-/g, '')}`;
  pendingDeviceTokens.set(token, fingerprint);
  return token;
}

export function issueSession(token: string, fingerprint: string): boolean {
  if (pendingDeviceTokens.get(token) !== fingerprint) return false;
  pendingDeviceTokens.delete(token);
  session = { fingerprint, expiresAt: Date.now() + SESSION_TTL_MS };
  return true;
}

export function rotateSession(fingerprint: string): boolean {
  if (!session || session.fingerprint !== fingerprint) return false;
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}


export function revokeSession(): void {
  session = null;
}

export function isSessionActive(): boolean {
  return session !== null && Date.now() < session.expiresAt;
}

export function expireSessionNow(): void {
  if (session) session.expiresAt = 0;
}

export function resetSessionState(): void {
  session = null;
  pendingDeviceTokens.clear();
}
