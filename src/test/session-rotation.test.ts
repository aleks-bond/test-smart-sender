import { http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { setSessionExpiredHandler } from '@/api/session-recovery';
import { signIn } from '@/features/auth/auth.api';
import { webhooksApi } from '@/features/webhooks/webhooks.api';
import { MOCK_USER } from '@/mocks/db';
import { server } from '@/mocks/node';
import { expireSessionNow } from '@/mocks/session';

function barrier(count: number) {
  let arrived = 0;
  let release!: () => void;
  const done = new Promise<void>((r) => (release = r));
  return () => {
    arrived += 1;
    if (arrived >= count) release();
    return done;
  };
}

describe('session rotation', () => {
  it('parallel 401s share one rotate', async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);

    await signIn({ email: MOCK_USER.email, password: MOCK_USER.password });
    expireSessionNow();

    const calls: string[] = [];
    server.events.on('request:start', ({ request }) => {
      calls.push(`${request.method} ${new URL(request.url).pathname}`);
    });

    const waitForBoth = barrier(2);
    let held = 0;
    server.use(
      http.get('*/v1/webhooks', async () => {
        if (held < 2) {
          held += 1;
          await waitForBoth();
        }
      }),
    );

    const [a, b] = await Promise.all([
      webhooksApi.list({ page: 1, search: '' }),
      webhooksApi.list({ page: 2, search: '' }),
    ]);

    expect(calls.filter((c) => c === 'POST /auth/token/rotate')).toHaveLength(1);
    expect(calls.filter((c) => c === 'GET /v1/webhooks')).toHaveLength(4);
    expect(a.paging.pages.current).toBe(1);
    expect(a.data).toHaveLength(10);
    expect(b.paging.pages.current).toBe(2);
    expect(b.data).toHaveLength(10);
    expect(onExpired).not.toHaveBeenCalled();

    server.events.removeAllListeners();
    setSessionExpiredHandler(null);
  });
});
