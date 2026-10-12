import { useState, type FormEvent } from 'react';
import { isApiError } from '@/api/errors';
import { Button } from '@/components/atoms/Button';
import { FieldError } from '@/components/atoms/FieldError';
import { FormField } from '@/components/molecules/FormField';
import { useUpdateWebhook } from './useUpdateWebhook';
import type { Webhook } from './webhook.types';

interface Props {
  webhook: Webhook;
  onSaved: () => void;
  onCancel: () => void;
}

export function WebhookEditForm({ webhook, onSaved, onCancel }: Props) {
  const [name, setName] = useState(webhook.name);
  const [url, setUrl] = useState(webhook.url);
  const mutation = useUpdateWebhook(webhook.id);

  const err = mutation.error;
  const fieldErrors = isApiError(err) && err.isValidation ? err.fieldErrors : {};
  const generalError = err && !(isApiError(err) && err.isValidation) ? err.message : null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({ name, url }, { onSuccess: onSaved });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} errors={fieldErrors.name} />
      <FormField id="url" label="URL" value={url} onChange={(e) => setUrl(e.target.value)} errors={fieldErrors.url} />
      {generalError && <FieldError messages={[generalError]} />}
      <div className="flex gap-2">
        <Button type="submit" loading={mutation.isPending}>Save</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
