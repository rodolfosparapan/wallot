import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

export function SettingsRow({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  onPress,
  danger,
}: SettingsRowProps) {
  const c = useThemeColors();
  const resolvedIconColor = iconColor ?? c.textMid;
  const resolvedIconBg = iconBg ?? c.greenSoft;
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.toggleIcon, { backgroundColor: danger ? c.redLight : resolvedIconBg }]}>
        <Ionicons name={icon} size={18} color={danger ? c.red : resolvedIconColor} />
      </View>
      <Text style={[styles.settingsLabel, danger && { color: c.red }]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {value && (
          <View style={styles.settingsValue}>
            <Text style={styles.settingsValueText}>{value}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={c.textDim} />
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      gap: 12,
    },
    toggleIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsLabel: {
      flex: 1,
      fontSize: typography.base,
      fontWeight: '600',
      color: c.text,
    },
    settingsValue: {
      backgroundColor: c.greenSoft,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.sm,
    },
    settingsValueText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: c.greenMid,
    },
  });
}
