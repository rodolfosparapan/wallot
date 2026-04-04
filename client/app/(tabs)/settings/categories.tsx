import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows, categoryColors } from '@/constants/theme';
import { CategoryIcon } from '@/components/ui';

const allCategories = [
  { key: 'food', label: 'Food' },
  { key: 'transport', label: 'Transport' },
  { key: 'housing', label: 'Housing' },
  { key: 'health', label: 'Health' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'education', label: 'Education' },
  { key: 'other', label: 'Other' },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState(allCategories.map((c) => c.key));

  const toggle = (key: string) => {
    setEnabled((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Default Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>Select which categories appear when adding entries.</Text>

      <View style={styles.grid}>
        {allCategories.map((cat) => {
          const isOn = enabled.includes(cat.key);
          const info = categoryColors[cat.key];
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.catCard, isOn && styles.catCardActive]}
              onPress={() => toggle(cat.key)}
              activeOpacity={0.7}
            >
              <CategoryIcon category={cat.key} size={40} />
              <Text style={[styles.catLabel, isOn && styles.catLabelActive]}>{cat.label}</Text>
              {isOn && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={10} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
        <Text style={styles.saveBtnText}>Save ({enabled.length} selected)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: 14,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', ...shadows.sm,
  },
  pageTitle: { fontSize: typography.lg, fontWeight: '800', color: colors.text },
  subtitle: {
    fontSize: typography.sm, color: colors.textMuted,
    paddingHorizontal: spacing.lg, marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.lg, gap: spacing.md,
  },
  catCard: {
    width: '22%', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, borderRadius: radius.base,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    position: 'relative', ...shadows.sm,
  },
  catCardActive: {
    borderColor: colors.green, backgroundColor: colors.greenSoft,
  },
  catLabel: { fontSize: typography.xs, fontWeight: '600', color: colors.textMid, textAlign: 'center' },
  catLabelActive: { color: colors.greenMid },
  checkBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center',
  },
  saveBtn: {
    margin: spacing.lg, backgroundColor: colors.green,
    borderRadius: radius.base, paddingVertical: spacing.base,
    alignItems: 'center', ...shadows.green,
  },
  saveBtnText: { color: colors.white, fontSize: typography.md, fontWeight: '700' },
});
