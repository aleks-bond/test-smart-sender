import { http, HttpResponse } from 'msw';
import type { WebhookList } from '@/features/webhooks/webhook.types';
import { db } from '../db';
import { checkCsrf, checkSession, notFound, validation } from '../guards';

const LIMIT = 10;

export const webhookHandlers = [
  http.get('*/v1/webhooks', ({ request }) => {
    const denied = checkSession();
    if (denied) return denied;
    const params = new URL(request.url).searchParams;
    const page = Math.max(1, Number(params.get('page')) || 1);
    const search = (params.get('search') ?? '').toLowerCase();
    const filtered = db.list().filter((w) => w.name.toLowerCase().includes(search));
    const body: WebhookList = {
      data: filtered.slice((page - 1) * LIMIT, page * LIMIT),
      paging: {
        pages: { current: page, last: Math.max(1, Math.ceil(filtered.length / LIMIT)) },
        results: { total: filtered.length, limitation: LIMIT },
      },
    };
    return HttpResponse.json(body);
  }),

  http.get('*/v1/webhooks/:id', ({ params }) => {
    const denied = checkSession();
    if (denied) return denied;
    const hook = db.find(Number(params.id));
    return hook ? HttpResponse.json(hook) : notFound();
  }),

  http.put('*/v1/webhooks/:id', async ({ request, params }) => {
    const denied = checkCsrf(request) ?? checkSession();
    if (denied) return denied;
    const { name = '', url = '' } = (await request.json()) as { name?: string; url?: string };
    // name required, url must be http/https
    const errors: Record<string, string[]> = {};
    if (!name.trim()) errors.name = ['The name field is required.'];
    if (!/^https?:\/\/[^\s/]+/i.test(url)) errors.url = ['The url must be a valid URL.'];
    if (Object.keys(errors).length) return validation(errors);
    return HttpResponse.json(db.update(Number(params.id), { name: name.trim(), url }));
  }),
];
