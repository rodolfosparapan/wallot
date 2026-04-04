import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, shadows } from '@/constants/theme';

const styles = StyleSheet.create({
  msgBubble: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '80%',
    ...shadows.sm,
  },
  msgBubbleUser: {
    backgroundColor: colors.greenDeep,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: typography.base,
    color: colors.text,
    lineHeight: 20,
  },
  msgTextUser: {
    color: colors.white,
  },
});

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
}

export function MessageBubble({ content, isUser }: MessageBubbleProps) {
  return (
    <View style={[styles.msgBubble, isUser && styles.msgBubbleUser]}>
      <Text style={[styles.msgText, isUser && styles.msgTextUser]}>
        {content}
      </Text>
    </View>
  );
}
