import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography, spacing, radius, shadows, categoryColors } from '@/constants/theme';
import { Card, ProgressBar, CategoryIcon, Badge } from '@/components/ui';
import { formatCurrency } from '@/hooks/useEntries';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { getHealthScore, getSpendingTrend, getCategoryBreakdown, getInsightChips, HealthScore } from '@/services/insightService';
import { InsightChip, CategoryBreakdown, SpendingTrendPoint } from '@/types';
import { useThemeColors } from '@/hooks/useThemeColors';

const trendTabs = ['3M', '6M', '1Y'];

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const monthPickerSt = useMemo(() => makeMonthPickerStyles(c), [c]);
  const [askText, setAskText] = useState('');
  const [trendTab, setTrendTab] = useState('3M');
  const [showAIAnswer, setShowAIAnswer] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [spendingTrend, setSpendingTrend] = useState<SpendingTrendPoint[]>([]);
  const [insightChips, setInsightChips] = useState<InsightChip[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const monthParam = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}`;
  const trendMonths = trendTab === '3M' ? 3 : trendTab === '6M' ? 6 : 12;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getHealthScore(),
      getSpendingTrend(trendMonths),
      getCategoryBreakdown(monthParam),
      getInsightChips(monthParam),
    ])
      .then(([hs, trend, breakdown, chips]) => {
        setHealthScore(hs);
        setSpendingTrend(trend);
        setCategoryBreakdown(breakdown);
        setInsightChips(chips);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [monthParam, trendMonths]);

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabel = `${MONTHS[selectedMonth.month]} ${selectedMonth.year}`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Insights</Text>
        <TouchableOpacity style={styles.monthPill} onPress={() => setShowMonthPicker(true)}>
          <Text style={styles.monthPillText}>{monthLabel}</Text>
          <Ionicons name="chevron-down" size={14} color={c.textMid} />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} color={c.green} />}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* AI Ask Card */}
        <View style={styles.section}>
          <Card style={styles.askCard}>
            <View style={styles.askHeader}>
              <Ionicons name="sparkles" size={16} color={c.green} />
              <Text style={styles.askLabel}>Ask Wallot AI</Text>
            </View>
            <View style={styles.askInputRow}>
              <TextInput
                style={styles.askInput}
                placeholder="What did I spend most on this month?"
                placeholderTextColor={c.textDim}
                value={askText}
                onChangeText={setAskText}
              />
              <TouchableOpacity
                style={styles.askSendBtn}
                onPress={() => setShowAIAnswer(true)}
              >
                <Ionicons name="send" size={16} color={c.white} />
              </TouchableOpacity>
            </View>
            {showAIAnswer && (
              <View style={styles.aiAnswer}>
                <Text style={styles.aiAnswerText}>
                  Your highest spending this month was on <Text style={{ fontWeight: '700' }}>Housing</Text> at R$1,500 (44%),
                  followed by <Text style={{ fontWeight: '700' }}>Food</Text> at R$978.35 (29%).
                  Consider reviewing your food budget — it's 2% over the limit you set.
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Health Score */}
        <View style={styles.section}>
          <View style={styles.healthCard}>
            <View style={styles.healthHeader}>
              <View>
                <Text style={styles.healthLabel}>Financial Health Score</Text>
                <View style={styles.healthScoreRow}>
                  <Text style={styles.healthScore}>{healthScore?.score ?? 0}</Text>
                  <Text style={styles.healthMax}>/ {healthScore?.max_score ?? 100}</Text>
                  <Badge
                    label={`${healthScore?.label ?? ''} ↑`}
                    color={c.greenLight}
                    bgColor="rgba(255,255,255,0.15)"
                    size="md"
                  />
                </View>
              </View>
              <Text style={styles.healthChange}>
                +{healthScore?.change ?? 0} vs {healthScore?.compared_to ?? ''}
              </Text>
            </View>
            <View style={styles.healthBarWrap}>
              <ProgressBar
                progress={(healthScore?.score ?? 0) / (healthScore?.max_score ?? 100)}
                color={c.green}
                height={8}
              />
              <View style={styles.healthLabels}>
                <Text style={styles.healthBarLabel}>Poor</Text>
                <Text style={styles.healthBarLabel}>Fair</Text>
                <Text style={styles.healthBarLabel}>Good</Text>
                <Text style={styles.healthBarLabel}>Great</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spending Trend */}
        <View style={styles.section}>
          <Card>
            <View style={styles.trendHeader}>
              <Text style={styles.trendTitle}>Spending Trend</Text>
              <View style={styles.trendTabs}>
                {trendTabs.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.trendTab, trendTab === t && styles.trendTabActive]}
                    onPress={() => setTrendTab(t)}
                  >
                    <Text
                      style={[
                        styles.trendTabText,
                        trendTab === t && styles.trendTabTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <SparklineChart data={spendingTrend} green={c.green} red={c.red} textDim={c.textDim} />
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: c.green }]} />
                <Text style={styles.legendText}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: c.red }]} />
                <Text style={styles.legendText}>Expenses</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Insight Chips */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quick Insights</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {insightChips.map((chip) => {
              const chipColors = {
                green: { bg: c.greenSoft, text: c.green, border: c.greenLight },
                red: { bg: c.redLight, text: c.red, border: '#fecaca' },
                yellow: { bg: c.yellowLight, text: '#b45309', border: '#fde68a' },
              };
              const col = chipColors[chip.color];
              return (
                <View
                  key={chip.id}
                  style={[
                    styles.insightChip,
                    { backgroundColor: col.bg, borderColor: col.border },
                  ]}
                >
                  <Ionicons name={chip.icon as any} size={18} color={col.text} />
                  <View>
                    <Text style={[styles.chipTitle, { color: col.text }]}>{chip.title}</Text>
                    <Text style={styles.chipSubtitle}>{chip.subtitle}</Text>
                  </View>
                  <Text style={[styles.chipValue, { color: col.text }]}>{chip.value}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Card>
            <Text style={styles.breakdownTitle}>Category Breakdown</Text>
            {categoryBreakdown.map((cat) => {
              const info = categoryColors[cat.category] || categoryColors.other;
              return (
                <View key={cat.category} style={styles.breakdownRow}>
                  <CategoryIcon category={cat.category} size={36} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.breakdownLabelRow}>
                      <Text style={styles.breakdownName}>
                        {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                      </Text>
                      <Text style={styles.breakdownAmount}>{formatCurrency(cat.amount)}</Text>
                    </View>
                    <View style={styles.breakdownBarRow}>
                      <ProgressBar
                        progress={cat.percentage / 100}
                        color={info.color}
                        height={4}
                        style={{ flex: 1 }}
                      />
                      <Text style={styles.breakdownPct}>{cat.percentage}%</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>

      {/* Month Picker Modal */}
      <Modal visible={showMonthPicker} transparent animationType="slide" onRequestClose={() => setShowMonthPicker(false)}>
        <TouchableOpacity style={monthPickerSt.overlay} activeOpacity={1} onPress={() => setShowMonthPicker(false)} />
        <View style={monthPickerSt.sheet}>
          <View style={monthPickerSt.handle} />
          <View style={monthPickerSt.yearRow}>
            <TouchableOpacity onPress={() => setSelectedMonth((p) => ({ ...p, year: p.year - 1 }))}>
              <Ionicons name="chevron-back" size={22} color={c.textMid} />
            </TouchableOpacity>
            <Text style={monthPickerSt.year}>{selectedMonth.year}</Text>
            <TouchableOpacity onPress={() => setSelectedMonth((p) => ({ ...p, year: p.year + 1 }))}>
              <Ionicons name="chevron-forward" size={22} color={c.textMid} />
            </TouchableOpacity>
          </View>
          <View style={monthPickerSt.grid}>
            {MONTHS.map((m, i) => {
              const isActive = i === selectedMonth.month;
              return (
                <TouchableOpacity
                  key={m}
                  style={[monthPickerSt.monthBtn, isActive && monthPickerSt.monthBtnActive]}
                  onPress={() => { setSelectedMonth((p) => ({ ...p, month: i })); setShowMonthPicker(false); }}
                >
                  <Text style={[monthPickerSt.monthText, isActive && monthPickerSt.monthTextActive]}>{m}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SparklineChart({
  data,
  green,
  red,
  textDim,
}: {
  data: { month: string; income: number; expenses: number }[];
  green: string;
  red: string;
  textDim: string;
}) {
  const width = 320;
  const height = 120;
  const padding = 10;

  if (!data.length) return null;

  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]));
  const getY = (val: number) => height - padding - ((val / maxVal) * (height - padding * 2));
  const getX = (i: number) => padding + (i / (data.length - 1)) * (width - padding * 2);

  const incomePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.income)}`).join(' ');
  const expensePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.expenses)}`).join(' ');
  const incomeArea = incomePath + ` L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

  return (
    <View style={{ alignItems: 'center', marginVertical: 12 }}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgGrad id="greenGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={green} stopOpacity="0.2" />
            <Stop offset="1" stopColor={green} stopOpacity="0" />
          </SvgGrad>
        </Defs>
        <Path d={incomeArea} fill="url(#greenGrad)" />
        <Path d={incomePath} stroke={green} strokeWidth={2.5} fill="none" />
        <Path d={expensePath} stroke={red} strokeWidth={2} fill="none" strokeDasharray="6,4" />
      </Svg>
      <View style={sparkStyles.months}>
        {data.map((d) => (
          <Text key={d.month} style={[sparkStyles.monthLabel, { color: textDim }]}>
            {d.month}
          </Text>
        ))}
      </View>
    </View>
  );
}

const sparkStyles = StyleSheet.create({
  months: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
    paddingHorizontal: 10,
  },
  monthLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
});

function makeMonthPickerStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    sheet: {
      backgroundColor: c.bg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: spacing.lg,
      paddingBottom: 40,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.border,
      alignSelf: 'center',
      marginBottom: spacing.lg,
    },
    yearRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    year: {
      fontSize: typography.lg,
      fontWeight: '800',
      color: c.text,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    monthBtn: {
      width: '22%',
      paddingVertical: 12,
      borderRadius: radius.base,
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
    },
    monthBtnActive: {
      backgroundColor: c.green,
      borderColor: c.green,
    },
    monthText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: c.textMid,
    },
    monthTextActive: {
      color: c.white,
    },
  });
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
    },
    pageTitle: {
      fontSize: typography.xl,
      fontWeight: '800',
      color: c.text,
    },
    monthPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: c.white,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: c.border,
      ...shadows.sm,
    },
    monthPillText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: c.textMid,
    },
    section: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    sectionLabel: {
      fontSize: typography.xs,
      fontWeight: '700',
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
    },
    askCard: {
      borderWidth: 1,
      borderColor: c.greenLight,
      backgroundColor: c.greenSoft,
    },
    askHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10,
    },
    askLabel: {
      fontSize: typography.sm,
      fontWeight: '700',
      color: c.green,
    },
    askInputRow: {
      flexDirection: 'row',
      gap: 8,
    },
    askInput: {
      flex: 1,
      backgroundColor: c.white,
      borderRadius: radius.base,
      paddingHorizontal: 14,
      height: 42,
      fontSize: typography.sm,
      color: c.text,
      borderWidth: 1,
      borderColor: c.border,
    },
    askSendBtn: {
      width: 42,
      height: 42,
      borderRadius: radius.base,
      backgroundColor: c.green,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aiAnswer: {
      marginTop: spacing.md,
      backgroundColor: c.white,
      borderRadius: radius.md,
      padding: spacing.base,
      borderWidth: 1,
      borderColor: c.border,
    },
    aiAnswerText: {
      fontSize: typography.sm,
      color: c.textMid,
      lineHeight: 20,
    },
    healthCard: {
      backgroundColor: c.greenDeep,
      borderRadius: radius.xl,
      padding: spacing.lg,
      ...shadows.green,
    },
    healthHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    healthLabel: {
      fontSize: typography.xs,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.5)',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 4,
    },
    healthScoreRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
    },
    healthScore: {
      fontSize: 40,
      fontWeight: '800',
      color: '#ffffff',
    },
    healthMax: {
      fontSize: typography.lg,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.4)',
      marginRight: 8,
    },
    healthChange: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: c.greenLight,
      marginTop: 8,
    },
    healthBarWrap: {
      gap: 6,
    },
    healthLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    healthBarLabel: {
      fontSize: 10,
      color: 'rgba(255,255,255,0.4)',
      fontWeight: '500',
    },
    trendHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    trendTitle: {
      fontSize: typography.md,
      fontWeight: '700',
      color: c.text,
    },
    trendTabs: {
      flexDirection: 'row',
      gap: 4,
    },
    trendTab: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: radius.sm,
    },
    trendTabActive: {
      backgroundColor: c.greenDeep,
    },
    trendTabText: {
      fontSize: typography.xs,
      fontWeight: '600',
      color: c.textMuted,
    },
    trendTabTextActive: {
      color: c.white,
    },
    legendRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: typography.xs,
      color: c.textMuted,
      fontWeight: '500',
    },
    insightChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      borderRadius: radius.base,
      borderWidth: 1,
      marginRight: 10,
      minWidth: 180,
    },
    chipTitle: {
      fontSize: typography.sm,
      fontWeight: '700',
    },
    chipSubtitle: {
      fontSize: typography.xs,
      color: c.textMuted,
      marginTop: 1,
    },
    chipValue: {
      fontSize: typography.md,
      fontWeight: '800',
      marginLeft: 'auto',
    },
    breakdownTitle: {
      fontSize: typography.md,
      fontWeight: '700',
      color: c.text,
      marginBottom: 14,
    },
    breakdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.base,
    },
    breakdownLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    breakdownName: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: c.text,
    },
    breakdownAmount: {
      fontSize: typography.sm,
      fontWeight: '700',
      color: c.text,
    },
    breakdownBarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    breakdownPct: {
      fontSize: typography.xs,
      fontWeight: '600',
      color: c.textMuted,
      width: 30,
      textAlign: 'right',
    },
  });
}
