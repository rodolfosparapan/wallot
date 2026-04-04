import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '@/constants/theme';

const WAVEFORM_HEIGHTS = [8, 14, 6, 18, 10, 16, 4, 12, 20, 8, 15, 7, 19, 11, 5, 17, 9, 13, 6, 14];

const styles = StyleSheet.create({
  voiceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadows.sm,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveBar: {
    width: 3,
    backgroundColor: colors.green,
    borderRadius: 2,
  },
});

export function VoiceBubble() {
  return (
    <View style={styles.voiceBubble}>
      <Ionicons name="mic" size={16} color={colors.green} />
      <View style={styles.waveform}>
        {WAVEFORM_HEIGHTS.map((h, i) => (
          <View
            key={i}
            style={[styles.waveBar, { height: h }]}
          />
        ))}
      </View>
    </View>
  );
}
