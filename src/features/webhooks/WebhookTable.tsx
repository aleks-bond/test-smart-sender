import { Link } from 'react-router-dom';
import { Badge } from '@/components/atoms/Badge';
import type { Webhook } from './webhook.types';

export function WebhookTable({ items, returnTo }: { items: Webhook[]; returnTo: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">URL</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((w) => (
            <tr key={w.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">{w.name}</td>
              <td className="max-w-xs truncate px-4 py-3 text-slate-600" title={w.url}>{w.url}</td>
              <td className="px-4 py-3">
                <Badge tone={w.active ? 'success' : 'neutral'}>{w.active ? 'Active' : 'Inactive'}</Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Link to={`/webhooks/${w.id}/edit`} state={{ returnTo }} className="text-indigo-600 hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
