import { authHandlers } from './auth';
import { csrfHandlers } from './csrf';
import { webhookHandlers } from './webhooks';

export const handlers = [...csrfHandlers, ...authHandlers, ...webhookHandlers];
