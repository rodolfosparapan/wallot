import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryIcon } from '@/components/ui';
import { colors, typography, radius } from '@/constants/theme';
import { formatCurrency } from '@/hooks/useEntries';
import { EntryData } from '@/types';

const styles = StyleSheet.create({
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
});

interface ConfirmCardProps {
  entryData: EntryData;
}

export function ConfirmCard({ entryData }: ConfirmCardProps) {
  const category = entryData.category || 'other';

  return (
    <View style={styles.confirmCard}>
      <View style={styles.confirmHeader}>
        <Ionicons name="checkmark-circle" size={16} color={colors.green} />
        <Text style={styles.confirmTitle}>Entry logged</Text>
      </View>
      <View style={styles.confirmBody}>
        <CategoryIcon category={category} size={36} />
        <View style={{ flex: 1 }}>
          <Text style={styles.confirmDesc}>{entryData.description}</Text>
          <Text style={styles.confirmCat}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </View>
        <Text style={styles.confirmAmount}>
          {formatCurrency(entryData.amount || 0)}
        </Text>
      </View>
    </View>
  );
}
