import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { LoginForm } from '@/features/auth/LoginForm';
import { useAuth } from '@/features/auth/useAuth';
import { MOCK_USER } from '@/mocks/db';

export function LoginPage() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/webhooks';

  if (status === 'authenticated') return <Navigate to={from} replace />;

  return (
    <AuthLayout title="Sign in">
      <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        Demo: <code>{MOCK_USER.email}</code> / <code>{MOCK_USER.password}</code>
      </div>
    </AuthLayout>
  );
}
