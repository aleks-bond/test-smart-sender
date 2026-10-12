export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  device_session_token: string;
}

export type AuthStatus = 'authenticated' | 'anonymous';
