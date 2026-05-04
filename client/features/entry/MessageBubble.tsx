import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, shadows } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

const styles = StyleSheet.create({
  msgBubble: {
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '80%',
    ...shadows.sm,
  },
  msgBubbleUser: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: typography.base,
    lineHeight: 20,
  },
});

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
}

export function MessageBubble({ content, isUser }: MessageBubbleProps) {
  const c = useThemeColors();

  return (
    <View style={[
      styles.msgBubble,
      { backgroundColor: isUser ? c.greenDeep : c.white },
      isUser && styles.msgBubbleUser,
    ]}>
      <Text style={[styles.msgText, { color: isUser ? '#ffffff' : c.text }]}>
        {content}
      </Text>
    </View>
  );
}
