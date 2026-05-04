import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { radius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color,
  height = 6,
  style,
}: ProgressBarProps) {
  const c = useThemeColors();
  const barColor = color ?? c.green;
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(progress * 100, 100)}%`,
            backgroundColor: barColor,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    progressTrack: {
      backgroundColor: c.greenSoft,
      width: '100%',
      overflow: 'hidden',
    },
    progressFill: {},
  });
}
