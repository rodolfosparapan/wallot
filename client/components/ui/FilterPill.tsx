import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { radius, typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

interface FilterPillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function FilterPill({ label, active, onPress }: FilterPillProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.filterPill, active && styles.filterPillActive]}
    >
      <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    filterPill: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radius.full,
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      marginRight: 8,
    },
    filterPillActive: {
      backgroundColor: c.greenDeep,
      borderColor: c.greenDeep,
    },
    filterPillText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: c.textMid,
    },
    filterPillTextActive: {
      color: c.white,
    },
  });
}
