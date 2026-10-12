import type { Webhook } from '@/features/webhooks/webhook.types';

export const MOCK_USER = {
  id: 1,
  email: 'demo@example.com',
  password: 'Password123!',
  first_name: 'Demo',
  last_name: 'User',
};

const NAMES = [
  'Order created', 'Order paid', 'Order shipped', 'Order cancelled', 'Refund issued',
  'Customer signup', 'Customer updated', 'Customer deleted', 'Newsletter subscribe', 'Newsletter unsubscribe',
  'Cart abandoned', 'Invoice generated', 'Invoice overdue', 'Payment failed', 'Subscription renewed',
  'Subscription cancelled', 'Lead captured', 'Chat started', 'Chat closed', 'Ticket opened',
  'Ticket resolved', 'Bot message sent', 'Campaign launched', 'Campaign finished', 'Contact tagged',
  'Contact untagged', 'Webinar registration',
];

function seed(): Webhook[] {
  const base = Date.UTC(2026, 0, 1);
  return NAMES.map((name, i) => ({
    id: i + 1,
    name,
    url: `https://hooks.example.com/${name.toLowerCase().replace(/\s+/g, '-')}`,
    active: i % 3 !== 0,
    created_at: new Date(base + i * 86_400_000).toISOString(),
  }));
}

let webhooks: Webhook[] = seed();

export const db = {
  list: (): Webhook[] => webhooks,
  find: (id: number): Webhook | undefined => webhooks.find((w) => w.id === id),
  update: (id: number, patch: Pick<Webhook, 'name' | 'url'>): Webhook | undefined => {
    const current = webhooks.find((w) => w.id === id);
    if (!current) return undefined;
    const next = { ...current, ...patch };
    webhooks = webhooks.map((w) => (w.id === id ? next : w));
    return next;
  },
  reset: (): void => {
    webhooks = seed();
  },
};
