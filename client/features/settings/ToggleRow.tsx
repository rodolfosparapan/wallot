import React, { useMemo } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ToggleRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange?: (val: boolean) => void;
}

export function ToggleRow({
  icon,
  iconColor,
  iconBg,
  label,
  description,
  value,
  onValueChange,
}: ToggleRowProps) {
  const c = useThemeColors();
  const resolvedIconColor = iconColor ?? c.green;
  const resolvedIconBg = iconBg ?? c.greenLight;
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={styles.toggleRow}>
      <View style={[styles.toggleIcon, { backgroundColor: resolvedIconBg }]}>
        <Ionicons name={icon} size={18} color={resolvedIconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description && <Text style={styles.toggleDesc}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e5e7eb', true: c.greenLight }}
        thumbColor={value ? c.green : '#f4f4f5'}
      />
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 7,
      gap: 12,
    },
    toggleIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleLabel: {
      fontSize: typography.base,
      fontWeight: '600',
      color: c.text,
    },
    toggleDesc: {
      fontSize: typography.xs,
      color: c.textMuted,
      marginTop: 2,
    },
  });
}
