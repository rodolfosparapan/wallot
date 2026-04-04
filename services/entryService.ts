import { api } from '@/lib/api';
import { Entry, MonthSummary } from '@/types';

interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface EntryQueryParams {
  type?: string;
  category?: string;
  month?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

function toQuery(params: EntryQueryParams): string {
  const q = new URLSearchParams();
  if (params.type) q.set('type', params.type);
  if (params.category) q.set('category', params.category);
  if (params.month) q.set('month', params.month);
  if (params.search) q.set('search', params.search);
  if (params.page) q.set('page', String(params.page));
  if (params.page_size) q.set('pageSize', String(params.page_size));
  return q.toString() ? `?${q}` : '';
}

export function getEntries(params: EntryQueryParams = {}): Promise<PagedResult<Entry>> {
  return api.get(`/api/entries${toQuery(params)}`);
}

export function getEntry(id: string): Promise<Entry> {
  return api.get(`/api/entries/${id}`);
}

export function createEntry(data: Omit<Entry, 'id' | 'user_id' | 'created_at'>): Promise<Entry> {
  return api.post('/api/entries', data);
}

export function updateEntry(id: string, data: Partial<Omit<Entry, 'id' | 'user_id' | 'created_at'>>): Promise<Entry> {
  return api.put(`/api/entries/${id}`, data);
}

export function deleteEntry(id: string): Promise<void> {
  return api.delete(`/api/entries/${id}`);
}

export function getMonthSummary(month: string): Promise<MonthSummary> {
  return api.get(`/api/entries/summary?month=${month}`);
}
