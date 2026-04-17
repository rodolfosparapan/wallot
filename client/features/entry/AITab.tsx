import { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, typography, shadows } from '@/constants/theme';
import { mockAIMessages } from '@/data/mock';
import { AIMessage } from '@/types';
import { MessageBubble } from './MessageBubble';
import { VoiceBubble } from './VoiceBubble';
import { ConfirmCard } from './ConfirmCard';
import { useAddEntryStyles } from './AddEntry.styles';
import { useThemeColors } from '@/hooks/useThemeColors';

export function AITab() {
  const [inputText, setInputText] = useState('');
  const c = useThemeColors();
  const sharedStyles = useAddEntryStyles();

  const renderMessage = ({ item }: { item: AIMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[sharedStyles.msgRow, isUser && sharedStyles.msgRowUser]}>
        {!isUser && (
          <View style={sharedStyles.botAvatar}>
            <Ionicons name="sparkles" size={14} color={c.white} />
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
        <View style={[sharedStyles.botAvatar]}>
          <Ionicons name="sparkles" size={14} color={c.white} />
        </View>
        <View style={[styles.typingBubble, { backgroundColor: c.white }]}>
          <View style={[styles.typingDot, { backgroundColor: c.textDim }]} />
          <View style={[styles.typingDot, { backgroundColor: c.textDim, opacity: 0.6 }]} />
          <View style={[styles.typingDot, { backgroundColor: c.textDim, opacity: 0.3 }]} />
        </View>
      </View>

      {/* Input Bar */}
      <View style={[styles.inputBar, { borderTopColor: c.border, backgroundColor: c.white }]}>
        <View style={[styles.chatInputWrap, { backgroundColor: c.bg, borderColor: c.border }]}>
          <TextInput
            style={[styles.chatInput, { color: c.text }]}
            placeholder="Type or speak..."
            placeholderTextColor={c.textDim}
            value={inputText}
            onChangeText={setInputText}
          />
        </View>
        <TouchableOpacity
          style={[styles.cameraBtn, { backgroundColor: c.bg, borderColor: c.border }]}
          onPress={() => Alert.alert('Coming soon', 'Photo input will be available soon.')}
        >
          <Ionicons name="camera" size={20} color={c.textMid} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.micBtn, { backgroundColor: c.green }]}
          onPress={() => Alert.alert('Coming soon', 'Voice input will be available soon.')}
        >
          <Ionicons name="mic" size={22} color={c.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...shadows.sm,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  chatInputWrap: {
    flex: 1,
    borderRadius: radius.base,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: 'center',
    borderWidth: 1,
  },
  chatInput: {
    fontSize: typography.base,
  },
  cameraBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.green,
  },
});
