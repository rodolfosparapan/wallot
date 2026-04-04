import { api } from '@/lib/api';
import { InsightChip, CategoryBreakdown, SpendingTrendPoint } from '@/types';

export interface HealthScore {
  score: number;
  max_score: number;
  label: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  compared_to: string;
}

export function getHealthScore(): Promise<HealthScore> {
  return api.get('/api/insights/health-score');
}

export function getSpendingTrend(months = 6): Promise<SpendingTrendPoint[]> {
  return api.get(`/api/insights/spending-trend?months=${months}`);
}

export function getCategoryBreakdown(month: string): Promise<CategoryBreakdown[]> {
  return api.get(`/api/insights/category-breakdown?month=${month}`);
}

export function getInsightChips(month: string): Promise<InsightChip[]> {
  return api.get(`/api/insights/chips?month=${month}`);
}
