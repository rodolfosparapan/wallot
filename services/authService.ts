import { api } from '@/lib/api';
import { User } from '@/types';

interface AuthResponse {
  token: string;
  user_id: string;
  email: string;
  full_name: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return api.post('/api/auth/login', { email, password });
}

export async function register(email: string, password: string, fullName: string): Promise<AuthResponse> {
  return api.post('/api/auth/register', { email, password, full_name: fullName });
}

export function toUser(res: AuthResponse): User {
  return {
    id: res.user_id,
    email: res.email,
    full_name: res.full_name,
    currency: 'BRL',
    language: 'pt-BR',
  };
}
