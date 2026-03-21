import { useMemo } from 'react'
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'
import { useEntriesStore } from '@/store'
import type { MonthSummary, Category } from '@/types'

// Returns summary for current month
export function useMonthSummary(): MonthSummary {
  const entries = useEntriesStore((s) => s.entries)

  return useMemo(() => {
    const now = new Date()
    const start = startOfMonth(now)
    const end = endOfMonth(now)

    const monthEntries = entries.filter((e) =>
      isWithinInterval(parseISO(e.date), { start, end })
    )

    const total_income = monthEntries
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0)

    const total_expenses = monthEntries
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0)

    // Group expenses by category
    const categoryMap: Record<string, number> = {}
    monthEntries
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        categoryMap[e.category] = (categoryMap[e.category] ?? 0) + e.amount
      })

    const top_categories = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category: category as Category,
        amount,
        percentage: total_expenses > 0 ? (amount / total_expenses) * 100 : 0,
      }))

    return {
      total_income,
      total_expenses,
      balance: total_income - total_expenses,
      top_categories,
    }
  }, [entries])
}

// Format currency
export function formatCurrency(amount: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

// Build context string for AI insights
export function useFinancialContext(): string {
  const entries = useEntriesStore((s) => s.entries)
  const summary = useMonthSummary()

  return useMemo(() => {
    return JSON.stringify({
      current_month_summary: summary,
      recent_entries: entries.slice(0, 20).map((e) => ({
        type: e.type,
        amount: e.amount,
        category: e.category,
        description: e.description,
        date: e.date,
      })),
    })
  }, [entries, summary])
}
