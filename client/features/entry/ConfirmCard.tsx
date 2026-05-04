import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryIcon } from '@/components/ui';
import { typography, radius } from '@/constants/theme';
import { formatCurrency } from '@/hooks/useEntries';
import { Entry } from '@/types';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ConfirmCardProps {
  entryData: Partial<Entry>;
}

export function ConfirmCard({ entryData }: ConfirmCardProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const category = entryData.category || 'other';

  return (
    <View style={styles.confirmCard}>
      <View style={styles.confirmHeader}>
        <Ionicons name="checkmark-circle" size={16} color={c.green} />
        <Text style={styles.confirmTitle}>Entry logged</Text>
      </View>
      <View style={styles.confirmBody}>
        <CategoryIcon category={category} size={36} />
        <View style={{ flex: 1 }}>
          <Text style={styles.confirmDesc}>{entryData.description}</Text>
          <Text style={styles.confirmCat}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </View>
        <Text style={styles.confirmAmount}>
          {formatCurrency(entryData.amount || 0)}
        </Text>
      </View>
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    confirmCard: {
      backgroundColor: c.greenSoft,
      borderRadius: radius.base,
      padding: 12,
      marginTop: 8,
      borderWidth: 1,
      borderColor: c.greenLight,
    },
    confirmHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10,
    },
    confirmTitle: {
      fontSize: typography.sm,
      fontWeight: '700',
      color: c.green,
    },
    confirmBody: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    confirmDesc: {
      fontSize: typography.base,
      fontWeight: '600',
      color: c.text,
    },
    confirmCat: {
      fontSize: typography.xs,
      color: c.textMuted,
      marginTop: 2,
    },
    confirmAmount: {
      fontSize: typography.md,
      fontWeight: '700',
      color: c.text,
    },
  });
}
