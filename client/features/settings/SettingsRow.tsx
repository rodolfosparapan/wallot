import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography } from '@/constants/theme';

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
  iconColor = colors.textMid,
  iconBg = colors.greenSoft,
  label,
  value,
  onPress,
  danger,
}: SettingsRowProps) {
  return (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.toggleIcon, { backgroundColor: danger ? colors.redLight : iconBg }]}>
        <Ionicons name={icon} size={18} color={danger ? colors.red : iconColor} />
      </View>
      <Text style={[styles.settingsLabel, danger && { color: colors.red }]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {value && (
          <View style={styles.settingsValue}>
            <Text style={styles.settingsValueText}>{value}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    color: colors.text,
  },
  settingsValue: {
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  settingsValueText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.greenMid,
  },
});
