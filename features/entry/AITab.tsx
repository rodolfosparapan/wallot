import { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { mockAIMessages } from '@/data/mock';
import { AIMessage } from '@/types';
import { MessageBubble } from './MessageBubble';
import { VoiceBubble } from './VoiceBubble';
import { ConfirmCard } from './ConfirmCard';
import { styles as sharedStyles } from './AddEntry.styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatArea: {
    padding: spacing.lg,
    gap: 16,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...shadows.sm,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textDim,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  chatInputWrap: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: radius.base,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatInput: {
    fontSize: typography.base,
    color: colors.text,
  },
  cameraBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.green,
  },
});

export function AITab() {
  const [inputText, setInputText] = useState('');

  const renderMessage = ({ item }: { item: AIMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[sharedStyles.msgRow, isUser && sharedStyles.msgRowUser]}>
        {!isUser && (
          <View style={sharedStyles.botAvatar}>
            <Ionicons name="sparkles" size={14} color={colors.white} />
          </View>
        )}
        <View style={{ flex: 1, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
          {item.type === 'voice' && !isUser ? (
            <VoiceBubble />
          ) : (
            <MessageBubble content={item.content} isUser={isUser} />
          )}

          {item.type === 'confirmation' && item.entryData && (
            <ConfirmCard entryData={item.entryData} />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={mockAIMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatArea}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      <View style={styles.typingRow}>
        <View style={styles.botAvatar}>
          <Ionicons name="sparkles" size={14} color={colors.white} />
        </View>
        <View style={styles.typingBubble}>
          <View style={[styles.typingDot, { animationDelay: '0s' }]} />
          <View style={[styles.typingDot, { opacity: 0.6 }]} />
          <View style={[styles.typingDot, { opacity: 0.3 }]} />
        </View>
      </View>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <View style={styles.chatInputWrap}>
          <TextInput
            style={styles.chatInput}
            placeholder="Type or speak..."
            placeholderTextColor={colors.textDim}
            value={inputText}
            onChangeText={setInputText}
          />
        </View>
        <TouchableOpacity style={styles.cameraBtn} onPress={() => Alert.alert('Coming soon', 'Photo input will be available soon.')}>
          <Ionicons name="camera" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.micBtn} onPress={() => Alert.alert('Coming soon', 'Voice input will be available soon.')}>
          <Ionicons name="mic" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
