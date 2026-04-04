import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows, categoryColors } from '@/constants/theme';
import { Card, CategoryIcon, ProgressBar, Badge, Divider } from '@/components/ui';
import { ToggleRow } from '@/features/settings';
import { formatCurrency } from '@/hooks/useEntries';
import { getBudgetLimits, createBudgetLimit } from '@/services/budgetLimitService';
import { getAlerts, updateAlert } from '@/services/alertService';
import { BudgetLimit, Alert as AlertType } from '@/types';

export default function LimitsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [limits, setLimits] = useState<BudgetLimit[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('food');
  const [newAmount, setNewAmount] = useState('');

  const categoryOptions = ['food', 'transport', 'housing', 'health', 'shopping', 'entertainment', 'education', 'other'];

  useEffect(() => {
    Promise.all([getBudgetLimits(), getAlerts()])
      .then(([l, a]) => { setLimits(l); setAlerts(a); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalBudget = limits.reduce((s, l) => s + l.limit_amount, 0);
  const totalSpent = limits.reduce((s, l) => s + l.spent_amount, 0);
  const remaining = totalBudget - totalSpent;

  const toggleAlert = async (id: string) => {
    const alert = alerts.find((a) => a.id === id);
    if (!alert) return;
    const updated = await updateAlert(id, !alert.enabled).catch(() => null);
    if (updated) setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const handleAddLimit = async () => {
    const amount = parseFloat(newAmount.replace(',', '.'));
    if (!amount || isNaN(amount)) return;
    try {
      const created = await createBudgetLimit({ category: newCategory, limit_amount: amount, period: 'monthly' });
      setLimits((prev) => [...prev.filter((l) => l.category !== newCategory), created]);
      setNewAmount('');
      setNewCategory('food');
      setShowAddModal(false);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to add limit.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Limits & Alerts</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} color={colors.green} />}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Overview Strip */}
        <View style={styles.overviewRow}>
          <Card style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Budget</Text>
            <Text style={styles.overviewValue}>{formatCurrency(totalBudget)}</Text>
          </Card>
          <Card style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Remaining</Text>
            <Text style={[styles.overviewValue, { color: remaining >= 0 ? colors.green : colors.red }]}>
              {formatCurrency(remaining)}
            </Text>
          </Card>
          <Card style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Goal</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="checkmark-circle" size={14} color={colors.green} />
              <Text style={[styles.overviewValue, { fontSize: typography.sm }]}>On track</Text>
            </View>
          </Card>
        </View>

        {/* Budget Limit Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Budget Limits</Text>
          {limits.map((limit) => {
            const percentage = Math.round((limit.spent_amount / limit.limit_amount) * 100);
            const remaining = limit.limit_amount - limit.spent_amount;
            const info = categoryColors[limit.category] || categoryColors.other;

            let status: { label: string; color: string; bgColor: string };
            if (percentage > 100) {
              status = {
                label: 'Over limit',
                color: colors.red,
                bgColor: colors.redLight,
              };
            } else if (percentage >= 80) {
              status = {
                label: 'Near limit',
                color: '#b45309',
                bgColor: colors.yellowLight,
              };
            } else {
              status = {
                label: 'On track',
                color: colors.green,
                bgColor: colors.greenSoft,
              };
            }

            const barColor =
              percentage > 100
                ? colors.red
                : percentage >= 80
                ? colors.yellow
                : colors.green;

            return (
              <Card key={limit.id} style={styles.limitCard}>
                <View style={styles.limitHeader}>
                  <CategoryIcon category={limit.category} size={42} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.limitNameRow}>
                      <Text style={styles.limitName}>
                        {limit.category.charAt(0).toUpperCase() + limit.category.slice(1)}
                      </Text>
                      <Badge
                        label={status.label}
                        color={status.color}
                        bgColor={status.bgColor}
                      />
                    </View>
                    <Text style={styles.limitSub}>
                      Limit: {formatCurrency(limit.limit_amount)}
                    </Text>
                  </View>
                </View>
                <View style={styles.limitBarRow}>
                  <ProgressBar progress={percentage / 100} color={barColor} height={6} style={{ flex: 1 }} />
                  <Text style={[styles.limitPct, { color: barColor }]}>{percentage}%</Text>
                </View>
                <Text style={styles.limitRemaining}>
                  {remaining >= 0
                    ? `${formatCurrency(remaining)} remaining`
                    : `Over by ${formatCurrency(Math.abs(remaining))}`}
                </Text>
              </Card>
            );
          })}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notifications</Text>
          <Card>
            {alerts.map((alert, i) => (
              <View key={alert.id}>
                <ToggleRow
                  icon={
                    alert.type === 'budget_warnings'
                      ? 'alert-circle'
                      : alert.type === 'over_limit'
                      ? 'warning'
                      : 'calendar'
                  }
                  iconColor={
                    alert.type === 'budget_warnings'
                      ? colors.yellow
                      : alert.type === 'over_limit'
                      ? colors.red
                      : colors.blue
                  }
                  iconBg={
                    alert.type === 'budget_warnings'
                      ? colors.yellowLight
                      : alert.type === 'over_limit'
                      ? colors.redLight
                      : colors.blueLight
                  }
                  label={alert.label}
                  description={alert.description}
                  value={alert.enabled}
                  onValueChange={() => toggleAlert(alert.id)}
                />
                {i < alerts.length - 1 && <Divider style={{ marginVertical: 0 }} />}
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      {/* Add Limit Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAddModal(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Budget Limit</Text>

            <Text style={styles.modalLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              {categoryOptions.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, newCategory === cat && styles.catPillActive]}
                  onPress={() => setNewCategory(cat)}
                >
                  <CategoryIcon category={cat} size={24} />
                  <Text style={[styles.catPillText, newCategory === cat && styles.catPillTextActive]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.modalLabel, { marginTop: spacing.lg }]}>Monthly Limit (R$)</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencyPrefix}>R$</Text>
              <TextInput
                style={styles.amountField}
                value={newAmount}
                onChangeText={setNewAmount}
                keyboardType="decimal-pad"
                placeholder="0,00"
                placeholderTextColor={colors.textDim}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, !newAmount.trim() && { opacity: 0.4 }]}
              onPress={handleAddLimit}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Add Limit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.greenDeep,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.green,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  overviewCard: {
    flex: 1,
    padding: spacing.base,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  limitCard: {
    marginBottom: 10,
    padding: 16,
  },
  limitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  limitNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  limitName: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.text,
  },
  limitSub: {
    fontSize: typography.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  limitBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  limitPct: {
    fontSize: typography.sm,
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },
  limitRemaining: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  modalLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catPillActive: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.green,
  },
  catPillText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textMid,
  },
  catPillTextActive: {
    color: colors.green,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.base,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    height: 52,
    ...shadows.sm,
  },
  currencyPrefix: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textMuted,
    marginRight: 8,
  },
  amountField: {
    flex: 1,
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.green,
    borderRadius: radius.base,
    paddingVertical: spacing.base,
    alignItems: 'center',
    marginTop: spacing.lg,
    ...shadows.green,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: '700',
  },
});
