import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { isApiError } from '@/api/errors';
import { StateMessage } from '@/components/molecules/StateMessage';
import { WebhookEditForm } from '@/features/webhooks/WebhookEditForm';
import { useWebhook } from '@/features/webhooks/useWebhook';

export function WebhookEditPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/webhooks';
  const { data, isPending, isError, error } = useWebhook(id);
  const back = () => navigate(returnTo);

  let content;
  if (!Number.isInteger(id) || id <= 0 || (isError && isApiError(error) && error.status === 404))
    content = <StateMessage variant="empty" title="Webhook not found." />;
  else if (isPending) content = <StateMessage variant="loading" title="Loading webhook…" />;
  else if (isError) content = <StateMessage variant="error" title={`Failed to load webhook: ${error.message}`} />;
  else content = <WebhookEditForm key={data.id} webhook={data} onSaved={back} onCancel={back} />;

  return (
    <section className="max-w-lg space-y-4">
      <Link to={returnTo} className="text-sm text-indigo-600 hover:underline">← Back to list</Link>
      <h1 className="text-xl font-semibold text-slate-900">Edit webhook</h1>
      {content}
    </section>
  );
}
