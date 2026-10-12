import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { WebhookEditPage } from '@/pages/WebhookEditPage';
import { WebhooksPage } from '@/pages/WebhooksPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/webhooks', element: <WebhooksPage /> },
          { path: '/webhooks/:id/edit', element: <WebhookEditPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/webhooks" replace /> },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});
