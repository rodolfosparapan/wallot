import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { CategoryIcon, FilterPill, Badge, Card } from '@/components/ui';
import { mockEntries, mockMonthSummary } from '@/data/mock';
import { formatCurrency, formatTime, groupEntriesByDate, getSourceLabel } from '@/hooks/useEntries';

const filters = ['All', 'Expenses', 'Income', 'Food', 'Transport', 'Housing', 'Health'];

export default function EntriesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredEntries = mockEntries.filter((entry) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !entry.description.toLowerCase().includes(q) &&
        !entry.category.toLowerCase().includes(q)
      )
        return false;
    }
    switch (activeFilter) {
      case 'Expenses':
        return entry.type === 'expense';
      case 'Income':
        return entry.type === 'income';
      case 'Food':
      case 'Transport':
      case 'Housing':
      case 'Health':
        return entry.category === activeFilter.toLowerCase();
      default:
        return true;
    }
  });

  const grouped = groupEntriesByDate(filteredEntries);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Entries</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setFilterSheetVisible(true)}>
            <Ionicons name="filter" size={18} color={colors.textMid} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/search')}>
            <Ionicons name="search" size={18} color={colors.textMid} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.textDim} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            placeholderTextColor={colors.textDim}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((f) => (
            <FilterPill
              key={f}
              label={f}
              active={activeFilter === f}
              onPress={() => setActiveFilter(f)}
            />
          ))}
        </ScrollView>

        {/* Summary Strip */}
        <View style={styles.summaryRow}>
          <Card style={[styles.summaryCard, { borderLeftWidth: 3, borderLeftColor: colors.green }]}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, { color: colors.green }]}>
              {formatCurrency(mockMonthSummary.total_income)}
            </Text>
          </Card>
          <Card style={[styles.summaryCard, { borderLeftWidth: 3, borderLeftColor: colors.red }]}>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryValue, { color: colors.red }]}>
              {formatCurrency(mockMonthSummary.total_expenses)}
            </Text>
          </Card>
        </View>

        {/* Grouped Entries */}
        {grouped.map((group) => (
          <View key={group.title} style={styles.dateGroup}>
            <Text style={styles.dateTitle}>{group.title}</Text>
            {group.data.map((entry) => (
              <View key={entry.id} style={styles.entryRow}>
                <CategoryIcon category={entry.category} size={42} />
                <View style={styles.entryInfo}>
                  <Text style={styles.entryDesc}>{entry.description}</Text>
                  <View style={styles.entryMeta}>
                    <Text style={styles.entryTime}>{formatTime(entry.date)}</Text>
                    <Text style={styles.entryCat}>
                      {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                    </Text>
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
        ))}
      </ScrollView>

      {/* Filter Sheet */}
      <Modal visible={filterSheetVisible} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Sort & Filter</Text>
            <Text style={styles.sheetSectionLabel}>Sort by</Text>
            <View style={styles.sheetRow}>
              {(['date', 'amount'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sheetChip, sortBy === s && styles.sheetChipActive]}
                  onPress={() => setSortBy(s)}
                >
                  <Text style={[styles.sheetChipText, sortBy === s && styles.sheetChipTextActive]}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sheetSectionLabel}>Order</Text>
            <View style={styles.sheetRow}>
              {([['desc', 'Newest first'], ['asc', 'Oldest first']] as const).map(([v, label]) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.sheetChip, sortOrder === v && styles.sheetChipActive]}
                  onPress={() => setSortOrder(v)}
                >
                  <Text style={[styles.sheetChipText, sortOrder === v && styles.sheetChipTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.sheetApplyBtn} onPress={() => setFilterSheetVisible(false)}>
              <Text style={styles.sheetApplyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  pageTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.text,
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.base,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 44,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: colors.text,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    padding: 14,
  },
  summaryLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: typography.lg,
    fontWeight: '700',
    marginTop: 4,
  },
  dateGroup: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  dateTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  entryCat: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  entryAmount: {
    fontSize: typography.base,
    fontWeight: '700',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: colors.textDim,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sheetSectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sheetRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  sheetChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetChipActive: {
    backgroundColor: colors.greenDeep,
    borderColor: colors.greenDeep,
  },
  sheetChipText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textMid,
  },
  sheetChipTextActive: {
    color: colors.white,
  },
  sheetApplyBtn: {
    backgroundColor: colors.green,
    borderRadius: radius.base,
    paddingVertical: spacing.base,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  sheetApplyText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: '700',
  },
});
