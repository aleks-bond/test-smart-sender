let token: string | null = null;
let inflight: Promise<string> | null = null;

export const CSRF_HEADER = 'X-CSRF-TOKEN';

export function getCachedCsrfToken(): string | null {
  return token;
}

export function invalidateCsrfToken(staleToken?: string | null): void {
  if (staleToken === undefined || staleToken === token) token = null;
}

export function ensureCsrfToken(fetchToken: () => Promise<string>): Promise<string> {
  if (token) return Promise.resolve(token);
  if (!inflight) {
    inflight = fetchToken()
      .then((t) => {
        token = t;
        return t;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function resetCsrf(): void {
  token = null;
  inflight = null;
}
