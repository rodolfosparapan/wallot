import { useMemo } from 'react';
import { mockEntries, mockMonthSummary } from '@/data/mock';
import { MonthSummary } from '@/types';

export function formatCurrency(amount: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function useMonthSummary(): MonthSummary {
  return useMemo(() => mockMonthSummary, []);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function groupEntriesByDate(entries: typeof mockEntries) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const groups: { title: string; data: typeof mockEntries }[] = [];
  const grouped: Record<string, typeof mockEntries> = {};

  entries.forEach((entry) => {
    const dateKey = entry.date.split('T')[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(entry);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  sortedDates.forEach((dateKey) => {
    let title: string;
    if (dateKey === today) {
      title = `Today — ${formatDateLabel(dateKey)}`;
    } else if (dateKey === yesterday) {
      title = `Yesterday — ${formatDateLabel(dateKey)}`;
    } else {
      title = formatDateLabel(dateKey);
    }
    groups.push({ title, data: grouped[dateKey] });
  });

  return groups;
}

function formatDateLabel(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getSourceLabel(source: string): string {
  switch (source) {
    case 'voice':
      return 'Voice';
    case 'photo':
      return 'Photo';
    case 'text':
      return 'Chat';
    case 'manual':
      return 'Manual';
    default:
      return source;
  }
}

export function getSourceIcon(source: string): string {
  switch (source) {
    case 'voice':
      return 'mic';
    case 'photo':
      return 'camera';
    case 'text':
      return 'chatbubble';
    case 'manual':
      return 'create';
    default:
      return 'help';
  }
}
