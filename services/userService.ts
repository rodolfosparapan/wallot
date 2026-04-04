import { api } from '@/lib/api';
import { User } from '@/types';

export function getMe(): Promise<User> {
  return api.get('/api/users/me');
}

export function updateMe(data: Partial<Pick<User, 'full_name' | 'avatar_url' | 'currency' | 'language'>>): Promise<User> {
  return api.put('/api/users/me', data);
}
