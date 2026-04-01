import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, shadows } from '@/constants/theme';
import { Card, CategoryIcon, SectionTitle, ProgressBar } from '@/components/ui';
import { BalanceCard } from '@/features/dashboard/BalanceCard';
import { EntryMethodsRow } from '@/features/dashboard/EntryMethodsRow';
import { RecentEntryRow } from '@/features/dashboard/RecentEntryRow';
import { mockEntries, mockMonthSummary, mockUser } from '@/data/mock';
import { getGreeting, formatCurrency } from '@/hooks/useEntries';
import { categoryColors } from '@/constants/theme';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const recentEntries = mockEntries.slice(0, 5);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color={colors.greenMid} />
            </View>
            <View>
              <Text style={styles.greetLine}>{getGreeting()}</Text>
              <Text style={styles.greetName}>{mockUser.full_name}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/dashboard/search')}>
              <Ionicons name="search" size={20} color={colors.textMid} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/dashboard/notifications')}>
              <Ionicons name="notifications" size={20} color={colors.textMid} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.section}>
          <BalanceCard
            balance={mockMonthSummary.balance}
            totalIncome={mockMonthSummary.total_income}
            totalExpenses={mockMonthSummary.total_expenses}
          />
        </View>

        {/* Entry Methods */}
        <View style={styles.section}>
          <EntryMethodsRow onPress={() => router.push('/entry/add')} />
        </View>

        {/* Top Categories */}
        <View style={styles.section}>
          <SectionTitle title="Top Categories" action="See all" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockMonthSummary.top_categories.map((cat) => {
              const catInfo = categoryColors[cat.category] || categoryColors.other;
              return (
                <Card key={cat.category} style={styles.categoryCard}>
                  <CategoryIcon category={cat.category} size={36} monochrome />
                  <Text style={styles.categoryName}>
                    {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                  </Text>
                  <Text style={styles.categoryAmount}>{formatCurrency(cat.amount)}</Text>
                  <View style={styles.categoryBottom}>
                    <ProgressBar
                      progress={cat.percentage / 100}
                      color={catInfo.color}
                      height={4}
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <Text style={[styles.categoryPct, { color: catInfo.color }]}>
                      {cat.percentage}%
                    </Text>
                  </View>
                </Card>
              );
            })}
          </ScrollView>
        </View>

        {/* Recent Entries */}
        <View style={styles.section}>
          <SectionTitle
            title="Recent Entries"
            action="See all"
            onAction={() => router.push('/(tabs)/entries')}
          />
          {recentEntries.map((entry) => (
            <RecentEntryRow key={entry.id} entry={entry} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    ...shadows.sm,
  },
  greetLine: {
    fontSize: typography.xs,
    color: colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetName: {
    fontSize: typography.md,
    color: colors.text,
    fontWeight: '800',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  categoryCard: {
    width: 140,
    marginRight: 10,
    padding: 14,
    gap: 8,
  },
  categoryName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textMid,
  },
  categoryAmount: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.text,
  },
  categoryBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPct: {
    fontSize: typography.xs,
    fontWeight: '700',
  },
});
