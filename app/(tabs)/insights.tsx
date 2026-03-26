import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows, categoryColors } from '@/constants/theme';
import { Card, ProgressBar, CategoryIcon, Badge } from '@/components/ui';
import {
  mockHealthScore,
  mockSpendingTrend,
  mockInsightChips,
  mockCategoryBreakdown,
} from '@/data/mock';
import { formatCurrency } from '@/hooks/useEntries';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';

const trendTabs = ['3M', '6M', '1Y'];

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const [askText, setAskText] = useState('');
  const [trendTab, setTrendTab] = useState('3M');
  const [showAIAnswer, setShowAIAnswer] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Insights</Text>
        <View style={styles.monthPill}>
          <Text style={styles.monthPillText}>Mar 2026</Text>
          <Ionicons name="chevron-down" size={14} color={colors.textMid} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* AI Ask Card */}
        <View style={styles.section}>
          <Card style={styles.askCard}>
            <View style={styles.askHeader}>
              <Ionicons name="sparkles" size={16} color={colors.green} />
              <Text style={styles.askLabel}>Ask Wallot AI</Text>
            </View>
            <View style={styles.askInputRow}>
              <TextInput
                style={styles.askInput}
                placeholder="What did I spend most on this month?"
                placeholderTextColor={colors.textDim}
                value={askText}
                onChangeText={setAskText}
              />
              <TouchableOpacity
                style={styles.askSendBtn}
                onPress={() => setShowAIAnswer(true)}
              >
                <Ionicons name="send" size={16} color={colors.white} />
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
                  <Text style={styles.healthScore}>{mockHealthScore.score}</Text>
                  <Text style={styles.healthMax}>/ {mockHealthScore.maxScore}</Text>
                  <Badge
                    label={`${mockHealthScore.label} ↑`}
                    color={colors.greenLight}
                    bgColor="rgba(255,255,255,0.15)"
                    size="md"
                  />
                </View>
              </View>
              <Text style={styles.healthChange}>
                +{mockHealthScore.change} vs {mockHealthScore.comparedTo}
              </Text>
            </View>
            <View style={styles.healthBarWrap}>
              <ProgressBar
                progress={mockHealthScore.score / mockHealthScore.maxScore}
                color={colors.green}
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
            <SparklineChart data={mockSpendingTrend} />
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.green }]} />
                <Text style={styles.legendText}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.red }]} />
                <Text style={styles.legendText}>Expenses</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Insight Chips */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quick Insights</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockInsightChips.map((chip) => {
              const chipColors = {
                green: { bg: colors.greenSoft, text: colors.green, border: colors.greenLight },
                red: { bg: colors.redLight, text: colors.red, border: '#fecaca' },
                yellow: { bg: colors.yellowLight, text: '#b45309', border: '#fde68a' },
              };
              const c = chipColors[chip.color];
              return (
                <View
                  key={chip.id}
                  style={[
                    styles.insightChip,
                    { backgroundColor: c.bg, borderColor: c.border },
                  ]}
                >
                  <Ionicons name={chip.icon as any} size={18} color={c.text} />
                  <View>
                    <Text style={[styles.chipTitle, { color: c.text }]}>{chip.title}</Text>
                    <Text style={styles.chipSubtitle}>{chip.subtitle}</Text>
                  </View>
                  <Text style={[styles.chipValue, { color: c.text }]}>{chip.value}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Card>
            <Text style={styles.breakdownTitle}>Category Breakdown</Text>
            {mockCategoryBreakdown.map((cat) => {
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
    </View>
  );
}

// Simple sparkline chart using SVG
function SparklineChart({
  data,
}: {
  data: { month: string; income: number; expenses: number }[];
}) {
  const width = 320;
  const height = 120;
  const padding = 10;

  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]));

  const getY = (val: number) =>
    height - padding - ((val / maxVal) * (height - padding * 2));
  const getX = (i: number) =>
    padding + (i / (data.length - 1)) * (width - padding * 2);

  const incomePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.income)}`)
    .join(' ');

  const expensePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.expenses)}`)
    .join(' ');

  const incomeArea =
    incomePath +
    ` L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

  return (
    <View style={{ alignItems: 'center', marginVertical: 12 }}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgGrad id="greenGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.green} stopOpacity="0.2" />
            <Stop offset="1" stopColor={colors.green} stopOpacity="0" />
          </SvgGrad>
        </Defs>
        <Path d={incomeArea} fill="url(#greenGrad)" />
        <Path d={incomePath} stroke={colors.green} strokeWidth={2.5} fill="none" />
        <Path d={expensePath} stroke={colors.red} strokeWidth={2} fill="none" strokeDasharray="6,4" />
      </Svg>
      <View style={sparkStyles.months}>
        {data.map((d) => (
          <Text key={d.month} style={sparkStyles.monthLabel}>
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
    color: colors.textDim,
    fontWeight: '500',
  },
});

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
  pageTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.text,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  monthPillText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textMid,
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
  askCard: {
    borderWidth: 1,
    borderColor: colors.greenLight,
    backgroundColor: colors.greenSoft,
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
    color: colors.green,
  },
  askInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  askInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.base,
    paddingHorizontal: 14,
    height: 42,
    fontSize: typography.sm,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  askSendBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.base,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAnswer: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiAnswerText: {
    fontSize: typography.sm,
    color: colors.textMid,
    lineHeight: 20,
  },
  healthCard: {
    backgroundColor: colors.greenDeep,
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
    color: colors.white,
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
    color: colors.greenLight,
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
    color: colors.text,
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
    backgroundColor: colors.greenDeep,
  },
  trendTabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textMuted,
  },
  trendTabTextActive: {
    color: colors.white,
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
    color: colors.textMuted,
    fontWeight: '500',
  },
  insightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    color: colors.textMuted,
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
    color: colors.text,
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breakdownName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.text,
  },
  breakdownAmount: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.text,
  },
  breakdownBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownPct: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textMuted,
    width: 30,
    textAlign: 'right',
  },
});
