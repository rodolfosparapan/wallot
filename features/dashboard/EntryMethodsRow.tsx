import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, typography } from '@/constants/theme';

const METHODS = [
  { icon: 'mic-outline', label: 'Voice', primary: true },
  { icon: 'camera-outline', label: 'Photo', primary: false },
  { icon: 'chatbubble-outline', label: 'Chat', primary: false },
  { icon: 'create-outline', label: 'Manual', primary: false },
] as const;

interface EntryMethodsRowProps {
  onPress: () => void;
}

export function EntryMethodsRow({ onPress }: EntryMethodsRowProps) {
  return (
    <View style={styles.methodsRow}>
      {METHODS.map((method) => (
        <TouchableOpacity
          key={method.label}
          style={styles.methodPill}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={[styles.methodIcon, method.primary && styles.methodIconPrimary]}>
            <Ionicons
              name={method.icon as any}
              size={22}
              color={method.primary ? colors.white : colors.textMid}
            />
          </View>
          <Text style={styles.methodLabel}>{method.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  methodsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  methodPill: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  methodIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  methodIconPrimary: {
    backgroundColor: colors.green,
    borderColor: colors.green,
    borderWidth: 0,
  },
  methodLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textMid,
  },
});
