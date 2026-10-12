const KEY = 'ss_fingerprint';
let memoryFallback: string | null = null;

function randomHex32(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const isFingerprint = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{32}$/.test(v);

export function getFingerprint(): string {
  const storage = typeof localStorage !== 'undefined' ? localStorage : null;
  const existing = storage?.getItem(KEY) ?? memoryFallback;
  if (isFingerprint(existing)) return existing;
  const fp = randomHex32();
  if (storage) storage.setItem(KEY, fp);
  else memoryFallback = fp;
  return fp;
}
