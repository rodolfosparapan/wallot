import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography, spacing, radius, shadows } from '@/constants/theme';
import { Card } from '@/components/ui';
import { updateMe } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const { user, setUser } = useAuthStore();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [selected, setSelected] = useState(user?.currency ?? 'BRL');

  const handleSelect = async (code: string) => {
    setSelected(code);
    updateMe({ currency: code }).then(setUser).catch(() => {});
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={c.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Currency</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Card>
          {currencies.map((cur, i) => (
            <View key={cur.code}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => handleSelect(cur.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.flag}>{cur.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{cur.label}</Text>
                  <Text style={styles.rowSub}>{cur.symbol} · {cur.code}</Text>
                </View>
                {selected === cur.code && (
                  <Ionicons name="checkmark-circle" size={22} color={c.green} />
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

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: spacing.lg, paddingVertical: 14,
    },
    backBtn: {
      width: 40, height: 40, borderRadius: 14,
      backgroundColor: c.white, borderWidth: 1, borderColor: c.border,
      alignItems: 'center', justifyContent: 'center', ...shadows.sm,
    },
    pageTitle: { fontSize: typography.lg, fontWeight: '800', color: c.text },
    content: { padding: spacing.lg },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14 },
    flag: { fontSize: 22 },
    rowLabel: { fontSize: typography.base, fontWeight: '600', color: c.text },
    rowSub: { fontSize: typography.sm, color: c.textMuted, marginTop: 2 },
    divider: { height: 1, backgroundColor: c.border },
  });
}
