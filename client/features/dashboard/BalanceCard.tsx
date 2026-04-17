import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, shadows, spacing, typography } from '@/constants/theme';
import { formatCurrency } from '@/hooks/useEntries';
import { useThemeColors } from '@/hooks/useThemeColors';

interface BalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

export function BalanceCard({ balance, totalIncome, totalExpenses }: BalanceCardProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>Monthly Balance</Text>
      <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStat}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="arrow-down" size={14} color={c.greenLight} />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statValue}>{formatCurrency(totalIncome)}</Text>
          </View>
        </View>
        <View style={styles.balanceDivider} />
        <View style={styles.balanceStat}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="arrow-up" size={14} color="#fca5a5" />
          </View>
          <View>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statValue}>{formatCurrency(totalExpenses)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    balanceCard: {
      backgroundColor: c.greenDeep,
      borderRadius: radius.xxl,
      padding: spacing.xl,
      ...shadows.green,
    },
    balanceLabel: {
      fontSize: typography.xs,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.6)',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    balanceAmount: {
      fontSize: 42,
      fontWeight: '800',
      color: '#ffffff',
      letterSpacing: -2,
      marginTop: 8,
      marginBottom: 18,
    },
    balanceStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    balanceStat: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    statIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statLabel: {
      fontSize: typography.xs,
      color: 'rgba(255,255,255,0.5)',
      fontWeight: '500',
    },
    statValue: {
      fontSize: typography.base,
      color: '#ffffff',
      fontWeight: '700',
      marginTop: 1,
    },
    balanceDivider: {
      width: 1,
      height: 32,
      backgroundColor: 'rgba(255,255,255,0.15)',
      marginHorizontal: 12,
    },
  });
}
