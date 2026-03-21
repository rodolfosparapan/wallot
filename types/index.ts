export type EntryType = 'expense' | 'income'

export type Category =
  | 'food'
  | 'housing'
  | 'transport'
  | 'health'
  | 'shopping'
  | 'entertainment'
  | 'education'
  | 'other'

export interface Entry {
  id: string
  user_id: string
  type: EntryType
  amount: number
  category: Category
  description: string
  date: string // ISO string
  created_at: string
  source: 'manual' | 'voice' | 'photo' | 'text'
}

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  currency: string
  language: string
}

export interface BudgetLimit {
  id: string
  user_id: string
  category: Category
  limit_amount: number
  period: 'monthly' | 'weekly'
}

export interface Alert {
  id: string
  user_id: string
  type: 'daily_limit' | 'category_limit' | 'weekly_summary' | 'monthly_report'
  enabled: boolean
  threshold?: number
}

export interface MonthSummary {
  total_income: number
  total_expenses: number
  balance: number
  top_categories: { category: Category; amount: number; percentage: number }[]
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}
