import { api } from '@/lib/api';
import { BudgetLimit } from '@/types';

export function getBudgetLimits(): Promise<BudgetLimit[]> {
  return api.get('/api/budget-limits');
}

export function createBudgetLimit(data: { category: string; limit_amount: number; period: string }): Promise<BudgetLimit> {
  return api.post('/api/budget-limits', data);
}

export function updateBudgetLimit(id: string, data: { limit_amount?: number; period?: string }): Promise<BudgetLimit> {
  return api.put(`/api/budget-limits/${id}`, data);
}

export function deleteBudgetLimit(id: string): Promise<void> {
  return api.delete(`/api/budget-limits/${id}`);
}
