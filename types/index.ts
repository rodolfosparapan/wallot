export type EntryType = 'expense' | 'income';

export type Category =
  | 'food'
  | 'housing'
  | 'transport'
  | 'health'
  | 'shopping'
  | 'entertainment'
  | 'education'
  | 'other';

export type EntrySource = 'manual' | 'voice' | 'photo' | 'text';

export interface Entry {
  id: string;
  user_id: string;
  type: EntryType;
  amount: number;
  category: Category | string;
  description: string;
  date: string;
  created_at: string;
  source: EntrySource;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  currency: string;
  language: string;
}

export interface BudgetLimit {
  id: string;
  user_id: string;
  category: Category;
  limit_amount: number;
  spent_amount: number;
  period: 'monthly' | 'weekly';
}

export interface Alert {
  id: string;
  user_id: string;
  type: 'budget_warnings' | 'over_limit' | 'weekly_summary';
  label: string;
  description: string;
  enabled: boolean;
}

export interface MonthSummary {
  total_income: number;
  total_expenses: number;
  balance: number;
  top_categories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'voice' | 'confirmation';
  entryData?: Partial<Entry>;
}

export interface InsightChip {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  color: 'green' | 'red' | 'yellow';
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface SpendingTrendPoint {
  month: string;
  income: number;
  expenses: number;
}
