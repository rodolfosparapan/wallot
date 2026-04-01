import { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows, categoryColors } from '@/constants/theme';
import { categories } from '@/constants/categories';
import { Category, EntryType } from '@/types';

const styles = StyleSheet.create({
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

export function ManualTab() {
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
            color={entryType === 'expense' ? 'white' : '#999'}
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
            color={entryType === 'income' ? 'white' : '#999'}
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
                color={isSelected ? 'white' : info.color}
              />
              <Text
                style={[styles.catChipText, isSelected && { color: 'white' }]}
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
        value={description}
        onChangeText={setDescription}
      />

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
        <Ionicons name="checkmark" size={20} color="white" />
        <Text style={styles.saveBtnText}>Save Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
