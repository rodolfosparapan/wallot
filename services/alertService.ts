import { api } from '@/lib/api';
import { Alert } from '@/types';

export function getAlerts(): Promise<Alert[]> {
  return api.get('/api/alerts');
}

export function updateAlert(id: string, enabled: boolean): Promise<Alert> {
  return api.put(`/api/alerts/${id}`, { enabled });
}
