import { useEffect } from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { format } from 'date-fns'
import { useAuthStore, useEntriesStore } from '@/store'
import { useMonthSummary, formatCurrency } from '@/hooks/useEntries'
import { Colors, FontSizes, Spacing, Radius, CategoryColors } from '@/constants/theme'
import { Card, SectionTitle } from '@/components/ui'
import type { Category } from '@/types'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { fetchEntries, entries } = useEntriesStore()
  const summary = useMonthSummary()

  useEffect(() => {
    if (user?.id) fetchEntries(user.id)
  }, [user?.id])

  const recentEntries = entries.slice(0, 5)
  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName}>{user?.full_name?.split(' ')[0] ?? 'there'}</Text>
          </View>
          <Text style={styles.month}>{format(new Date(), 'MMMM yyyy')}</Text>
        </View>

        {/* Balance hero card */}
        <Card elevated style={styles.balanceCard}>
          <Text style={styles.balLabel}>Available balance</Text>
          <Text style={styles.balAmount}>{formatCurrency(summary.balance)}</Text>
          <Text style={styles.balTrend}>Updated just now</Text>
        </Card>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={[styles.statVal, { color: Colors.income }]}>
              {formatCurrency(summary.total_income)}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={[styles.statVal, { color: Colors.expense }]}>
              {formatCurrency(summary.total_expenses)}
            </Text>
          </Card>
        </View>

        {/* Top 3 expenses */}
        {summary.top_categories.length > 0 && (
          <View style={styles.section}>
            <SectionTitle title="Top expenses this month" />
            {summary.top_categories.map((item) => (
              <TopCategoryRow key={item.category} item={item} />
            ))}
          </View>
        )}

        {/* Recent entries */}
        {recentEntries.length > 0 && (
          <View style={styles.section}>
            <SectionTitle title="Recent entries" />
            {recentEntries.map((entry) => (
              <Card key={entry.id} style={styles.entryCard}>
                <View style={styles.entryRow}>
                  <View
                    style={[
                      styles.entryDot,
                      { backgroundColor: CategoryColors[entry.category] ?? Colors.other },
                    ]}
                  />
                  <View style={styles.entryInfo}>
                    <Text style={styles.entryName}>{entry.description}</Text>
                    <Text style={styles.entryCat}>
                      {entry.category} · {format(new Date(entry.date), 'dd MMM')}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.entryAmt,
                      { color: entry.type === 'income' ? Colors.income : Colors.expense },
                    ]}
                  >
                    {entry.type === 'income' ? '+' : '-'}
                    {formatCurrency(entry.amount)}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

function TopCategoryRow({
  item,
}: {
  item: { category: Category; amount: number; percentage: number }
}) {
  const color = CategoryColors[item.category] ?? Colors.other
  return (
    <View style={styles.topCatRow}>
      <View style={[styles.topCatDot, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <View style={styles.topCatHeader}>
          <Text style={styles.topCatName}>{item.category}</Text>
          <Text style={styles.topCatAmt}>{formatCurrency(item.amount)}</Text>
        </View>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              { width: `${item.percentage}%` as any, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  greeting: { fontSize: FontSizes.sm, color: Colors.textMuted },
  userName: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  month: { fontSize: FontSizes.sm, color: Colors.textHint, marginTop: 4 },
  balanceCard: { marginBottom: Spacing.md, padding: Spacing.lg },
  balLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  balAmount: { fontSize: 36, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1, marginVertical: 4 },
  balTrend: { fontSize: FontSizes.xs, color: Colors.primary },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: { flex: 1 },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textHint, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  statVal: { fontSize: FontSizes.lg, fontWeight: '700' },
  section: { marginBottom: Spacing.lg },
  topCatRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  topCatDot: { width: 8, height: 8, borderRadius: 4 },
  topCatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  topCatName: { fontSize: FontSizes.sm, color: Colors.textSecondary, textTransform: 'capitalize' },
  topCatAmt: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textPrimary },
  barBg: { height: 4, backgroundColor: Colors.border, borderRadius: 2 },
  barFill: { height: 4, borderRadius: 2 },
  entryCard: { marginBottom: Spacing.xs, padding: Spacing.sm },
  entryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  entryDot: { width: 8, height: 8, borderRadius: 4 },
  entryInfo: { flex: 1 },
  entryName: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.textPrimary },
  entryCat: { fontSize: FontSizes.xs, color: Colors.textHint, textTransform: 'capitalize' },
  entryAmt: { fontSize: FontSizes.sm, fontWeight: '700' },
})
