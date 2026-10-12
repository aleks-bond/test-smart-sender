import { createContext } from 'react';
import type { AuthStatus, LoginCredentials, User } from './auth.types';

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (c: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
