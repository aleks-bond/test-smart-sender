export interface Webhook {
  id: number;
  name: string;
  url: string;
  active: boolean;
  created_at: string;
}

export interface Paging {
  pages: { current: number; last: number };
  results: { total: number; limitation: number };
}

export interface WebhookList {
  data: Webhook[];
  paging: Paging;
}

export interface WebhookListParams {
  page: number;
  search: string;
}

export type WebhookInput = Pick<Webhook, 'name' | 'url'>;
