import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Header } from '../organisms/Header';

export function MainLayout() {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = () => {
    setLoggingOut(true);
    logout().catch(() => undefined);
  };
  return (
    <div className="min-h-screen">
      <Header onLogout={handleLogout} loggingOut={loggingOut} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
