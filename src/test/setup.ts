import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/mocks/node';
import { db } from '@/mocks/db';
import { resetSessionState } from '@/mocks/session';
import { resetCsrf } from '@/api/csrf';
import { resetSessionRecovery, setSessionExpiredHandler } from '@/api/session-recovery';
import { deviceTokenStore } from '@/lib/device-token';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetSessionState();
  db.reset();
  server.events.removeAllListeners();
  resetCsrf();
  resetSessionRecovery();
  setSessionExpiredHandler(null);
  deviceTokenStore.clear();
});
afterAll(() => server.close());
