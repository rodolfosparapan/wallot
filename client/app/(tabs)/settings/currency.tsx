import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { Card } from '@/components/ui';

const currencies = [
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
  { code: 'ARS', symbol: '$', label: 'Argentine Peso', flag: '🇦🇷' },
];

export default function CurrencyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('BRL');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Currency</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Card>
          {currencies.map((c, i) => (
            <View key={c.code}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => setSelected(c.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.flag}>{c.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{c.label}</Text>
                  <Text style={styles.rowSub}>{c.symbol} · {c.code}</Text>
                </View>
                {selected === c.code && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.green} />
                )}
              </TouchableOpacity>
              {i < currencies.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </View>
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
  content: { padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14 },
  flag: { fontSize: 22 },
  rowLabel: { fontSize: typography.base, fontWeight: '600', color: colors.text },
  rowSub: { fontSize: typography.sm, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border },
});
