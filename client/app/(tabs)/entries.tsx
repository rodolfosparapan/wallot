import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography, spacing, radius, shadows } from '@/constants/theme';
import { CategoryIcon, FilterPill, Badge, Card } from '@/components/ui';
import { formatCurrency, formatTime, groupEntriesByDate, getSourceLabel } from '@/hooks/useEntries';
import { getEntries, getMonthSummary } from '@/services/entryService';
import { Entry, MonthSummary } from '@/types';
import { useThemeColors } from '@/hooks/useThemeColors';

const filters = ['All', 'Expenses', 'Income', 'Food', 'Transport', 'Housing', 'Health'];

function currentMonthParam() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function EntriesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [summary, setSummary] = useState<MonthSummary>({ total_income: 0, total_expenses: 0, balance: 0, top_categories: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const month = currentMonthParam();
    const typeParam = activeFilter === 'Expenses' ? 'expense' : activeFilter === 'Income' ? 'income' : undefined;
    const categoryParam = ['Food', 'Transport', 'Housing', 'Health'].includes(activeFilter)
      ? activeFilter.toLowerCase()
      : undefined;
    try {
      const [e, s] = await Promise.all([
        getEntries({ type: typeParam, category: categoryParam, search: search || undefined, page_size: 100 }),
        getMonthSummary(month),
      ]);
      setEntries(e.data);
      setSummary(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const grouped = groupEntriesByDate(entries);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Entries</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setFilterSheetVisible(true)}>
            <Ionicons name="filter" size={18} color={c.textMid} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/search')}>
            <Ionicons name="search" size={18} color={c.textMid} />
          </TouchableOpacity>
        </View>
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} color={c.green} />}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={c.textDim} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            placeholderTextColor={c.textDim}
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
          <Card style={[styles.summaryCard, { borderLeftWidth: 3, borderLeftColor: c.green }]}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, { color: c.green }]}>
              {formatCurrency(summary.total_income)}
            </Text>
          </Card>
          <Card style={[styles.summaryCard, { borderLeftWidth: 3, borderLeftColor: c.red }]}>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryValue, { color: c.red }]}>
              {formatCurrency(summary.total_expenses)}
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
                      color={c.green}
                      bgColor={c.greenLight}
                    />
                  </View>
                </View>
                <Text
                  style={[
                    styles.entryAmount,
                    { color: entry.type === 'income' ? c.green : c.red },
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

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
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
      color: c.text,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginHorizontal: spacing.lg,
      backgroundColor: c.white,
      borderRadius: radius.base,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
      height: 44,
      ...shadows.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: typography.base,
      color: c.text,
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
      color: c.textMuted,
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
      color: c.textMuted,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    entryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 13,
      gap: 12,
      backgroundColor: c.white,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 8,
      ...shadows.sm,
    },
    entryInfo: {
      flex: 1,
    },
    entryDesc: {
      fontSize: typography.base,
      fontWeight: '600',
      color: c.text,
    },
    entryMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
    },
    entryTime: {
      fontSize: typography.xs,
      color: c.textMuted,
    },
    entryCat: {
      fontSize: typography.xs,
      color: c.textMuted,
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
      backgroundColor: c.white,
      borderTopLeftRadius: radius.xxl,
      borderTopRightRadius: radius.xxl,
      padding: spacing.xl,
      gap: spacing.md,
    },
    sheetHandle: {
      width: 36,
      height: 4,
      backgroundColor: c.textDim,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: spacing.sm,
    },
    sheetTitle: {
      fontSize: typography.lg,
      fontWeight: '800',
      color: c.text,
      marginBottom: spacing.sm,
    },
    sheetSectionLabel: {
      fontSize: typography.xs,
      fontWeight: '700',
      color: c.textMuted,
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
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
    },
    sheetChipActive: {
      backgroundColor: c.greenDeep,
      borderColor: c.greenDeep,
    },
    sheetChipText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: c.textMid,
    },
    sheetChipTextActive: {
      color: c.white,
    },
    sheetApplyBtn: {
      backgroundColor: c.green,
      borderRadius: radius.base,
      paddingVertical: spacing.base,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    sheetApplyText: {
      color: c.white,
      fontSize: typography.md,
      fontWeight: '700',
    },
  });
}
