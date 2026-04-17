import { useMemo, useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { typography, spacing, radius, shadows, categoryColors } from '@/constants/theme';
import { categories } from '@/constants/categories';
import { Category, EntryType } from '@/types';
import { createEntry } from '@/services/entryService';
import { useThemeColors } from '@/hooks/useThemeColors';

export function ManualTab() {
  const router = useRouter();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [entryType, setEntryType] = useState<EntryType>('expense');
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState<Category>('food');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!parsed || isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount.');
      return;
    }
    setSaving(true);
    try {
      await createEntry({
        type: entryType,
        amount: parsed,
        category: selectedCategory,
        description: description.trim(),
        date: new Date().toISOString(),
        source: 'manual',
      });
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to save entry.');
    } finally {
      setSaving(false);
    }
  };

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
          <Text style={[styles.typeBtnText, entryType === 'expense' && styles.typeBtnTextActive]}>
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
          <Text style={[styles.typeBtnText, entryType === 'income' && styles.typeBtnTextActive]}>
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
          placeholderTextColor={c.textDim}
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
              <Text style={[styles.catChipText, isSelected && { color: 'white' }]}>
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
        placeholderTextColor={c.textDim}
        value={description}
        onChangeText={setDescription}
      />

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="checkmark" size={20} color="white" />
            <Text style={styles.saveBtnText}>Save Entry</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    manualContent: {
      padding: spacing.lg,
      gap: 20,
    },
    typeToggle: {
      flexDirection: 'row',
      backgroundColor: c.white,
      borderRadius: radius.lg,
      padding: 4,
      borderWidth: 1,
      borderColor: c.border,
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
      backgroundColor: c.red,
    },
    typeBtnActiveInc: {
      backgroundColor: c.green,
    },
    typeBtnText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: c.textMuted,
    },
    typeBtnTextActive: {
      color: c.white,
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
      color: c.textMuted,
    },
    amountInput: {
      fontSize: 48,
      fontWeight: '800',
      color: c.text,
      minWidth: 60,
      textAlign: 'center',
    },
    catLabel: {
      fontSize: typography.xs,
      fontWeight: '700',
      color: c.textMuted,
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
      backgroundColor: c.white,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: c.border,
    },
    catChipText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: c.textMid,
    },
    descInput: {
      backgroundColor: c.white,
      borderRadius: radius.base,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: typography.base,
      color: c.text,
    },
    saveBtn: {
      backgroundColor: c.green,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
      borderRadius: radius.base,
      ...shadows.green,
    },
    saveBtnText: {
      color: c.white,
      fontSize: typography.md,
      fontWeight: '700',
    },
  });
}
