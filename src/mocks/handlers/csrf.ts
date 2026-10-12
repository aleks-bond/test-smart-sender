import { http, HttpResponse } from 'msw';
import { CSRF_TOKEN } from '../guards';

export const csrfHandlers = [
  http.get('*/csrf', () => new HttpResponse(null, { status: 204, headers: { 'X-CSRF-TOKEN': CSRF_TOKEN } })),
];
