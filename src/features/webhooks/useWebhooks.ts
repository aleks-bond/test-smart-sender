import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { webhookKeys, webhooksApi } from './webhooks.api';
import type { WebhookListParams } from './webhook.types';

export function useWebhooks(params: WebhookListParams) {
  return useQuery({
    queryKey: webhookKeys.list(params),
    queryFn: ({ signal }) => webhooksApi.list(params, signal),
    placeholderData: keepPreviousData,
  });
}
