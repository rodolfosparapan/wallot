import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

interface DividerProps {
  style?: ViewStyle;
}

export function Divider({ style }: DividerProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  return <View style={[styles.divider, style]} />;
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: spacing.md,
    },
  });
}
