import { useMutation, useQueryClient } from '@tanstack/react-query';
import { webhookKeys, webhooksApi } from './webhooks.api';
import type { WebhookInput } from './webhook.types';

export function useUpdateWebhook(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: WebhookInput) => webhooksApi.update(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(webhookKeys.detail(id), updated);
      return qc.invalidateQueries({ queryKey: webhookKeys.all });
    },
  });
}
