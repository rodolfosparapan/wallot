import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { Card, CategoryIcon, SectionTitle, ProgressBar, Badge } from '@/components/ui';
import { mockEntries, mockMonthSummary, mockUser } from '@/data/mock';
import { formatCurrency, getGreeting, formatTime, getSourceLabel } from '@/hooks/useEntries';
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
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="search" size={20} color={colors.textMid} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="notifications" size={20} color={colors.textMid} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.section}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Monthly Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(mockMonthSummary.balance)}</Text>
            <View style={styles.balanceStats}>
              <View style={styles.balanceStat}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <Ionicons name="arrow-down" size={14} color={colors.greenLight} />
                </View>
                <View>
                  <Text style={styles.statLabel}>Income</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(mockMonthSummary.total_income)}
                  </Text>
                </View>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceStat}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <Ionicons name="arrow-up" size={14} color="#fca5a5" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Expenses</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(mockMonthSummary.total_expenses)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Entry Methods */}
        <View style={styles.section}>
          <View style={styles.methodsRow}>
            {[
              { icon: 'mic', label: 'Voice', primary: true },
              { icon: 'camera', label: 'Photo', primary: false },
              { icon: 'chatbubble', label: 'Chat', primary: false },
              { icon: 'create', label: 'Manual', primary: false },
            ].map((method) => (
              <TouchableOpacity
                key={method.label}
                style={[
                  styles.methodPill,
                  method.primary && styles.methodPillPrimary,
                ]}
                onPress={() => router.push('/entry/add')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={method.icon as any}
                  size={20}
                  color={method.primary ? colors.white : colors.textMid}
                />
                <Text
                  style={[
                    styles.methodLabel,
                    method.primary && styles.methodLabelPrimary,
                  ]}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top Categories */}
        <View style={styles.section}>
          <SectionTitle title="Top Categories" action="See all" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockMonthSummary.top_categories.map((cat) => {
              const catInfo = categoryColors[cat.category] || categoryColors.other;
              return (
                <Card key={cat.category} style={styles.categoryCard}>
                  <CategoryIcon category={cat.category} size={36} />
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
            <View key={entry.id} style={styles.entryRow}>
              <CategoryIcon category={entry.category} size={42} />
              <View style={styles.entryInfo}>
                <Text style={styles.entryDesc}>{entry.description}</Text>
                <View style={styles.entryMeta}>
                  <Text style={styles.entryTime}>{formatTime(entry.date)}</Text>
                  <Badge
                    label={getSourceLabel(entry.source)}
                    color={colors.green}
                    bgColor={colors.greenLight}
                  />
                </View>
              </View>
              <Text
                style={[
                  styles.entryAmount,
                  { color: entry.type === 'income' ? colors.green : colors.red },
                ]}
              >
                {entry.type === 'expense' ? '- ' : '+ '}
                {formatCurrency(entry.amount)}
              </Text>
            </View>
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
  balanceCard: {
    backgroundColor: colors.greenDeep,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.green,
  },
  balanceLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    marginTop: 4,
    marginBottom: 20,
  },
  balanceStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  statValue: {
    fontSize: typography.base,
    color: colors.white,
    fontWeight: '700',
    marginTop: 1,
  },
  balanceDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 12,
  },
  methodsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  methodPill: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderRadius: radius.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  methodPillPrimary: {
    backgroundColor: colors.green,
    borderColor: colors.green,
    ...shadows.green,
  },
  methodLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textMid,
  },
  methodLabelPrimary: {
    color: colors.white,
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
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  entryInfo: {
    flex: 1,
  },
  entryDesc: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.text,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  entryTime: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  entryAmount: {
    fontSize: typography.base,
    fontWeight: '700',
  },
});
