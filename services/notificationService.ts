import { api } from '@/lib/api';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export function getNotifications(): Promise<Notification[]> {
  return api.get('/api/notifications');
}

export function markRead(id: string): Promise<void> {
  return api.put(`/api/notifications/${id}/read`, {});
}

export function markAllRead(): Promise<void> {
  return api.put('/api/notifications/read-all', {});
}
