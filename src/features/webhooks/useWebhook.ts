import { useQuery } from '@tanstack/react-query';
import { webhookKeys, webhooksApi } from './webhooks.api';

export function useWebhook(id: number) {
  return useQuery({
    queryKey: webhookKeys.detail(id),
    queryFn: ({ signal }) => webhooksApi.get(id, signal),
    enabled: Number.isInteger(id) && id > 0,
  });
}
