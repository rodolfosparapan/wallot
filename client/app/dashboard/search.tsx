import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography, spacing, radius, shadows } from '@/constants/theme';
import { CategoryIcon, Badge } from '@/components/ui';
import { mockEntries } from '@/data/mock';
import { formatCurrency, formatTime, getSourceLabel } from '@/hooks/useEntries';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? mockEntries.filter((e) => {
        const q = query.toLowerCase();
        return (
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={c.textMid} />
        </TouchableOpacity>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={c.textDim} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            placeholderTextColor={c.textDim}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={c.textDim} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.trim() === '' ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="search" size={32} color={c.textDim} />
          </View>
          <Text style={styles.emptyTitle}>Search your entries</Text>
          <Text style={styles.emptySubtitle}>Type to search by description or category</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="document-text-outline" size={32} color={c.textDim} />
          </View>
          <Text style={styles.emptyTitle}>No results</Text>
          <Text style={styles.emptySubtitle}>No entries match "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.entryRow}>
              <CategoryIcon category={item.category} size={42} />
              <View style={styles.entryInfo}>
                <Text style={styles.entryDesc}>{item.description}</Text>
                <View style={styles.entryMeta}>
                  <Text style={styles.entryTime}>{formatTime(item.date)}</Text>
                  <Text style={styles.entryCat}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </Text>
                  <Badge label={getSourceLabel(item.source)} color={c.green} bgColor={c.greenLight} />
                </View>
              </View>
              <Text style={[styles.entryAmount, { color: item.type === 'income' ? c.green : c.red }]}>
                {item.type === 'expense' ? '- ' : '+ '}{formatCurrency(item.amount)}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      paddingHorizontal: spacing.lg, paddingVertical: 14,
    },
    backBtn: {
      width: 40, height: 40, borderRadius: 14,
      backgroundColor: c.white, borderWidth: 1, borderColor: c.border,
      alignItems: 'center', justifyContent: 'center', ...shadows.sm,
    },
    searchWrap: {
      flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      backgroundColor: c.white, borderRadius: radius.base,
      borderWidth: 1, borderColor: c.border,
      paddingHorizontal: spacing.base, height: 44, ...shadows.sm,
    },
    searchInput: { flex: 1, fontSize: typography.base, color: c.text },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingBottom: 80 },
    emptyIcon: {
      width: 72, height: 72, borderRadius: 24,
      backgroundColor: c.greenSoft, alignItems: 'center', justifyContent: 'center',
    },
    emptyTitle: { fontSize: typography.lg, fontWeight: '700', color: c.text },
    emptySubtitle: { fontSize: typography.base, color: c.textMuted },
    list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    entryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: spacing.md },
    entryInfo: { flex: 1 },
    entryDesc: { fontSize: typography.base, fontWeight: '600', color: c.text },
    entryMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
    entryTime: { fontSize: typography.xs, color: c.textMuted },
    entryCat: { fontSize: typography.xs, color: c.textMuted },
    entryAmount: { fontSize: typography.base, fontWeight: '700' },
    separator: { height: 1, backgroundColor: c.border },
  });
}
