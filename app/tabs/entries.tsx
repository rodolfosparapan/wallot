import { useState, useMemo } from 'react'
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { format, isThisWeek, isToday, isYesterday } from 'date-fns'
import { useEntriesStore } from '@/store'
import { Colors, FontSizes, Spacing, Radius, CategoryColors } from '@/constants/theme'
import { SectionTitle } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import type { Entry } from '@/types'

type Filter = 'all' | 'expense' | 'income'

export default function Entries() {
  const { entries, removeEntry } = useEntriesStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchType = filter === 'all' || e.type === filter
      const matchSearch =
        !search ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
  }, [entries, filter, search])

  // Group by date label
  const grouped = useMemo(() => {
    const groups: { title: string; data: Entry[] }[] = []
    const map: Record<string, Entry[]> = {}

    filtered.forEach((entry) => {
      const d = new Date(entry.date)
      const key = isToday(d)
        ? 'Today'
        : isYesterday(d)
        ? 'Yesterday'
        : isThisWeek(d)
        ? format(d, 'EEEE')
        : format(d, 'MMMM d, yyyy')

      if (!map[key]) {
        map[key] = []
        groups.push({ title: key, data: [] })
      }
      map[key].push(entry)
    })

    return groups.map((g) => ({ ...g, data: map[g.title] }))
  }, [filtered])

  const deleteEntry = async (entry: Entry) => {
    Alert.alert('Delete entry', `Delete "${entry.description}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('entries').delete().eq('id', entry.id)
          removeEntry(entry.id)
        },
      },
    ])
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'expense', label: 'Expenses' },
    { key: 'income', label: 'Income' },
  ]

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Entries</Text>

        {/* Search */}
        <TextInput
          style={styles.search}
          placeholder="Search entries..."
          placeholderTextColor={Colors.textHint}
          value={search}
          onChangeText={setSearch}
        />

        {/* Filter pills */}
        <View style={styles.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        {grouped.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No entries yet.</Text>
            <Text style={styles.emptySubText}>Tap + to add your first entry.</Text>
          </View>
        ) : (
          <FlatList
            data={grouped}
            keyExtractor={(item) => item.title}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item: group }) => (
              <View style={styles.group}>
                <SectionTitle title={group.title} />
                {group.data.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} onDelete={() => deleteEntry(entry)} />
                ))}
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

function EntryRow({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const color = CategoryColors[entry.category] ?? Colors.other
  const sourceIcon =
    entry.source === 'voice' ? '🎙️' : entry.source === 'photo' ? '📸' : '✏️'

  return (
    <TouchableOpacity onLongPress={onDelete} style={styles.entryRow}>
      <View style={[styles.entryDot, { backgroundColor: color }]} />
      <View style={styles.entryInfo}>
        <Text style={styles.entryName}>{entry.description}</Text>
        <Text style={styles.entryMeta}>
          {sourceIcon} {entry.category} · {format(new Date(entry.date), 'HH:mm')}
        </Text>
      </View>
      <Text style={[styles.entryAmt, { color: entry.type === 'income' ? Colors.income : Colors.expense }]}>
        {entry.type === 'income' ? '+' : '-'}R${entry.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: Spacing.lg },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  search: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  filterPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  filterTextActive: { color: Colors.bg, fontWeight: '700' },
  group: { marginBottom: Spacing.md },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  entryDot: { width: 10, height: 10, borderRadius: 5 },
  entryInfo: { flex: 1 },
  entryName: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.textPrimary },
  entryMeta: {
    fontSize: FontSizes.xs,
    color: Colors.textHint,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  entryAmt: { fontSize: FontSizes.sm, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSizes.lg, color: Colors.textMuted, fontWeight: '700' },
  emptySubText: { fontSize: FontSizes.sm, color: Colors.textHint, marginTop: 4 },
})
