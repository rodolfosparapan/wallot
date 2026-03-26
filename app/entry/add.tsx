import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows, categoryColors } from '@/constants/theme';
import { CategoryIcon, Badge } from '@/components/ui';
import { mockAIMessages } from '@/data/mock';
import { formatCurrency } from '@/hooks/useEntries';
import { AIMessage, Category, EntryType } from '@/types';

const categories: { key: Category; label: string }[] = [
  { key: 'food', label: 'Food' },
  { key: 'transport', label: 'Transport' },
  { key: 'housing', label: 'Housing' },
  { key: 'health', label: 'Health' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'education', label: 'Education' },
  { key: 'other', label: 'Other' },
];

export default function AddEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Add Entry</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabWrap}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ai' && styles.tabActive]}
            onPress={() => setActiveTab('ai')}
          >
            <Ionicons
              name="sparkles"
              size={14}
              color={activeTab === 'ai' ? colors.white : colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'ai' && styles.tabTextActive]}>
              AI — Smart Entry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'manual' && styles.tabActive]}
            onPress={() => setActiveTab('manual')}
          >
            <Ionicons
              name="create"
              size={14}
              color={activeTab === 'manual' ? colors.white : colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'manual' && styles.tabTextActive]}>
              Manual
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'ai' ? <AITab /> : <ManualTab />}
    </View>
  );
}

// ── AI Tab ──
function AITab() {
  const [inputText, setInputText] = useState('');

  const renderMessage = ({ item }: { item: AIMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={14} color={colors.white} />
          </View>
        )}
        <View style={{ flex: 1, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
          {item.type === 'voice' && !isUser ? (
            <View style={styles.voiceBubble}>
              <Ionicons name="mic" size={16} color={colors.green} />
              <View style={styles.waveform}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      { height: 4 + Math.random() * 16 },
                    ]}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={[styles.msgBubble, isUser && styles.msgBubbleUser]}>
              <Text style={[styles.msgText, isUser && styles.msgTextUser]}>
                {item.content}
              </Text>
            </View>
          )}

          {item.type === 'confirmation' && item.entryData && (
            <View style={styles.confirmCard}>
              <View style={styles.confirmHeader}>
                <Ionicons name="checkmark-circle" size={16} color={colors.green} />
                <Text style={styles.confirmTitle}>Entry logged</Text>
              </View>
              <View style={styles.confirmBody}>
                <CategoryIcon category={item.entryData.category || 'other'} size={36} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.confirmDesc}>{item.entryData.description}</Text>
                  <Text style={styles.confirmCat}>
                    {(item.entryData.category || 'other').charAt(0).toUpperCase() +
                      (item.entryData.category || 'other').slice(1)}
                  </Text>
                </View>
                <Text style={styles.confirmAmount}>
                  {formatCurrency(item.entryData.amount || 0)}
                </Text>
              </View>
            </View>
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
        <TouchableOpacity style={styles.cameraBtn}>
          <Ionicons name="camera" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.micBtn}>
          <Ionicons name="mic" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Manual Tab ──
function ManualTab() {
  const [entryType, setEntryType] = useState<EntryType>('expense');
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState<Category>('food');
  const [description, setDescription] = useState('');

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.manualContent}>
      {/* Type Toggle */}
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.typeBtn, entryType === 'expense' && styles.typeBtnActiveExp]}
          onPress={() => setEntryType('expense')}
        >
          <Ionicons
            name="arrow-up"
            size={16}
            color={entryType === 'expense' ? colors.white : colors.textMuted}
          />
          <Text
            style={[styles.typeBtnText, entryType === 'expense' && styles.typeBtnTextActive]}
          >
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, entryType === 'income' && styles.typeBtnActiveInc]}
          onPress={() => setEntryType('income')}
        >
          <Ionicons
            name="arrow-down"
            size={16}
            color={entryType === 'income' ? colors.white : colors.textMuted}
          />
          <Text
            style={[styles.typeBtnText, entryType === 'income' && styles.typeBtnTextActive]}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount */}
      <View style={styles.amountWrap}>
        <Text style={styles.amountCurrency}>R$</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textDim}
        />
      </View>

      {/* Categories */}
      <Text style={styles.catLabel}>Category</Text>
      <View style={styles.catGrid}>
        {categories.map((cat) => {
          const info = categoryColors[cat.key] || categoryColors.other;
          const isSelected = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.catChip,
                isSelected && { backgroundColor: info.color, borderColor: info.color },
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Ionicons
                name={info.icon as any}
                size={18}
                color={isSelected ? colors.white : info.color}
              />
              <Text
                style={[styles.catChipText, isSelected && { color: colors.white }]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Description */}
      <TextInput
        style={styles.descInput}
        placeholder="Add a description..."
        placeholderTextColor={colors.textDim}
        value={description}
        onChangeText={setDescription}
      />

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
        <Ionicons name="checkmark" size={20} color={colors.white} />
        <Text style={styles.saveBtnText}>Save Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  pageTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colors.text,
  },
  tabWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 14,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.base,
  },
  tabActive: {
    backgroundColor: colors.greenDeep,
  },
  tabText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.white,
  },

  // AI Tab
  chatArea: {
    padding: spacing.lg,
    gap: 16,
  },
  msgRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  msgRowUser: {
    flexDirection: 'row-reverse',
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  confirmCard: {
    backgroundColor: colors.greenSoft,
    borderRadius: radius.base,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.greenLight,
  },
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  confirmTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.green,
  },
  confirmBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  confirmDesc: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.text,
  },
  confirmCat: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  confirmAmount: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.text,
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

  // Manual Tab
  manualContent: {
    padding: spacing.lg,
    gap: 20,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.base,
  },
  typeBtnActiveExp: {
    backgroundColor: colors.red,
  },
  typeBtnActiveInc: {
    backgroundColor: colors.green,
  },
  typeBtnText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.textMuted,
  },
  typeBtnTextActive: {
    color: colors.white,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 20,
  },
  amountCurrency: {
    fontSize: typography.xl,
    fontWeight: '600',
    color: colors.textMuted,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    minWidth: 60,
    textAlign: 'center',
  },
  catLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textMid,
  },
  descInput: {
    backgroundColor: colors.white,
    borderRadius: radius.base,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: typography.base,
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: radius.base,
    ...shadows.green,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: '700',
  },
});
