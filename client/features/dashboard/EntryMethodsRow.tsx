import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadows, typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);

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
              color={method.primary ? c.white : c.textMid}
            />
          </View>
          <Text style={styles.methodLabel}>{method.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
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
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    methodIconPrimary: {
      backgroundColor: c.green,
      borderColor: c.green,
      borderWidth: 0,
    },
    methodLabel: {
      fontSize: typography.xs,
      fontWeight: '600',
      color: c.textMid,
    },
  });
}
