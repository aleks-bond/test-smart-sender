import type { HttpMethod } from './api.types';
import { CSRF_HEADER, ensureCsrfToken, getCachedCsrfToken, invalidateCsrfToken } from './csrf';
import { ApiError, toApiError } from './errors';
import { expireLocalSession, recoverSession } from './session-recovery';
import { getFingerprint } from '@/lib/fingerprint';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
  recoverSession?: boolean;
}

const ROTATE_PATH = '/auth/token/rotate';
const NO_RECOVERY_PATHS = new Set(['/auth/login', '/auth/token/issue', ROTATE_PATH, '/auth/token/revoke', '/csrf']);

function baseUrl(): string {
  return typeof window !== 'undefined' && window.location ? window.location.origin : 'http://localhost';
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(path, baseUrl());
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

const needsCsrf = (method: HttpMethod) => method === 'POST' || method === 'PUT';

async function fetchCsrf(): Promise<string> {
  const res = await fetch(buildUrl('/csrf'), {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'include',
  });
  const t = res.headers.get(CSRF_HEADER);
  if (!res.ok || !t) throw await toApiError(res);
  return t;
}

async function send(path: string, opts: RequestOptions, csrfRetried = false): Promise<Response> {
  const method = opts.method ?? 'GET';
  await ensureCsrfToken(fetchCsrf);

  const headers = new Headers({ Accept: 'application/json' });
  for (const [k, v] of Object.entries(opts.headers ?? {})) headers.set(k, v);
  headers.set('X-Requested-With', 'XMLHttpRequest');
  if (opts.body !== undefined) headers.set('Content-Type', 'application/json');
  headers.delete(CSRF_HEADER);
  const usedCsrf = needsCsrf(method) ? getCachedCsrfToken() : null;
  if (usedCsrf) headers.set(CSRF_HEADER, usedCsrf);

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method,
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      credentials: 'include',
      signal: opts.signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ApiError(0, 'NetworkError', 'Network error');
  }

  // 419: refetch csrf token and retry once
  if (res.status === 419 && !csrfRetried) {
    invalidateCsrfToken(usedCsrf);
    return send(path, opts, true);
  }
  return res;
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// rotate uses send directly so it never triggers another rotate
function rotateSession(): Promise<void> {
  return send(ROTATE_PATH, { method: 'POST', body: { fingerprint: getFingerprint() } }).then(async (res) => {
    if (!res.ok) throw await toApiError(res);
  });
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const recover = (opts.recoverSession ?? true) && !NO_RECOVERY_PATHS.has(path);
  // 401: rotate and retry once
  let res = await send(path, opts);

  if (res.status === 401 && recover) {
    try {
      await recoverSession(rotateSession);
    } catch (e) {
      expireLocalSession();
      throw e instanceof ApiError ? e : new ApiError(401, 'AuthenticationException', 'Session expired');
    }
    res = await send(path, opts);
    if (res.status === 401) {
      expireLocalSession();
      throw await toApiError(res);
    }
  }

  if (!res.ok) throw await toApiError(res);
  return parse<T>(res);
}
