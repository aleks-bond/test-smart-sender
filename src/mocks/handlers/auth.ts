import { http, HttpResponse } from 'msw';
import { MOCK_USER } from '../db';
import { badRequest, checkCsrf, checkSession, validation } from '../guards';
import { createDeviceToken, issueSession, revokeSession, rotateSession } from '../session';

type Body = { email?: string; password?: string; fingerprint?: string; device_session_token?: string };

export const authHandlers = [
  http.post('*/auth/login', async ({ request }) => {
    const csrf = checkCsrf(request);
    if (csrf) return csrf;
    // captcha: any non-empty value
    if (!request.headers.get('X-Captcha-Token')) return badRequest();
    const body = (await request.json()) as Body;
    if (body.email !== MOCK_USER.email || body.password !== MOCK_USER.password) {
      return validation({ password: ['These credentials do not match our records.'] });
    }
    return HttpResponse.json({ device_session_token: createDeviceToken(body.fingerprint ?? '') });
  }),

  http.post('*/auth/token/issue', async ({ request }) => {
    const csrf = checkCsrf(request);
    if (csrf) return csrf;
    const body = (await request.json()) as Body;
    if (!issueSession(body.device_session_token ?? '', body.fingerprint ?? '')) {
      return validation({ device_session_token: ['The device session token is invalid.'] });
    }
    return new HttpResponse(null, { status: 200 });
  }),

  http.post('*/auth/token/rotate', async ({ request }) => {
    const csrf = checkCsrf(request);
    if (csrf) return csrf;
    const body = (await request.json()) as Body;
    if (!rotateSession(body.fingerprint ?? '')) return badRequest();
    return new HttpResponse(null, { status: 200 });
  }),

  http.post('*/auth/token/revoke', ({ request }) => {
    const csrf = checkCsrf(request);
    if (csrf) return csrf;
    revokeSession();
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/v1/me', () => {
    const denied = checkSession();
    if (denied) return denied;
    const { id, email, first_name, last_name } = MOCK_USER;
    return HttpResponse.json({ id, email, first_name, last_name, name: `${first_name} ${last_name}` });
  }),
];
