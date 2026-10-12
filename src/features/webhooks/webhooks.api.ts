import { request } from '@/api/client';
import type { Webhook, WebhookInput, WebhookList, WebhookListParams } from './webhook.types';

export const PAGE_SIZE = 10;

export const webhookKeys = {
  all: ['webhooks'] as const,
  list: (p: WebhookListParams) => ['webhooks', 'list', p] as const,
  detail: (id: number) => ['webhooks', 'detail', id] as const,
};

export const webhooksApi = {
  list: ({ page, search }: WebhookListParams, signal?: AbortSignal) =>
    request<WebhookList>('/v1/webhooks', { query: { page, limit: PAGE_SIZE, search }, signal }),
  get: (id: number, signal?: AbortSignal) => request<Webhook>(`/v1/webhooks/${id}`, { signal }),
  update: (id: number, input: WebhookInput) => request<Webhook>(`/v1/webhooks/${id}`, { method: 'PUT', body: input }),
};
