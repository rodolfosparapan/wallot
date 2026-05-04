import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

const WAVEFORM_HEIGHTS = [8, 14, 6, 18, 10, 16, 4, 12, 20, 8, 15, 7, 19, 11, 5, 17, 9, 13, 6, 14];

const staticStyles = StyleSheet.create({
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
  },
});

export function VoiceBubble() {
  const c = useThemeColors();

  return (
    <View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: c.white,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      ...shadows.sm,
    }]}>
      <Ionicons name="mic" size={16} color={c.green} />
      <View style={staticStyles.waveform}>
        {WAVEFORM_HEIGHTS.map((h, i) => (
          <View
            key={i}
            style={[staticStyles.waveBar, { height: h, backgroundColor: c.green }]}
          />
        ))}
      </View>
    </View>
  );
}
