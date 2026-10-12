import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { markSessionEnded, setSessionExpiredHandler } from '@/api/session-recovery';
import { deviceTokenStore } from '@/lib/device-token';
import { authApi, signIn } from './auth.api';
import { AuthContext } from './auth-context';
import type { AuthStatus, LoginCredentials, User } from './auth.types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('anonymous');
  // ignore stale async auth results
  const generation = useRef(0);

  const clearLocal = useCallback(() => {
    generation.current += 1;
    deviceTokenStore.clear();
    queryClient.cancelQueries();
    queryClient.clear();
    setUser(null);
    setStatus('anonymous');
  }, [queryClient]);

  useEffect(() => {
    setSessionExpiredHandler(clearLocal);
    return () => setSessionExpiredHandler(null);
  }, [clearLocal]);

  const login = useCallback(async (c: LoginCredentials) => {
    const gen = ++generation.current;
    const u = await signIn(c);
    if (gen !== generation.current) return;
    setUser(u);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    generation.current += 1;
    markSessionEnded();
    try {
      await authApi.revoke();
    } finally {
      clearLocal();
    }
  }, [clearLocal]);

  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
