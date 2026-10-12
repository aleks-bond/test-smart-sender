let inflight: Promise<void> | null = null;
let onSessionExpired: (() => void) | null = null;
let sessionEnded = false;

export function setSessionExpiredHandler(handler: (() => void) | null): void {
  onSessionExpired = handler;
}

export function markSessionStarted(): void {
  sessionEnded = false;
}

export function markSessionEnded(): void {
  sessionEnded = true;
}

// runs once per session
export function expireLocalSession(): void {
  if (sessionEnded) return;
  sessionEnded = true;
  onSessionExpired?.();
}

// one shared rotate for all parallel 401s
export function recoverSession(rotate: () => Promise<void>): Promise<void> {
  if (!inflight) {
    inflight = rotate().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

export function resetSessionRecovery(): void {
  inflight = null;
  sessionEnded = false;
}
