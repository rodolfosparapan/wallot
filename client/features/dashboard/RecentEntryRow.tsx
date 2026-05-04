import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '@/constants/theme';
import { Card, CategoryIcon, Badge, Amount } from '@/components/ui';
import { formatTime, getSourceLabel } from '@/hooks/useEntries';
import { useThemeColors } from '@/hooks/useThemeColors';

interface Entry {
  id: string;
  category: string;
  description: string;
  date: string;
  source: string;
  type: 'income' | 'expense';
  amount: number;
}

interface RecentEntryRowProps {
  entry: Entry;
}

export function RecentEntryRow({ entry }: RecentEntryRowProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <Card style={styles.entryRow}>
      <CategoryIcon category={entry.category} size={42} monochrome />
      <View style={styles.entryInfo}>
        <Text style={styles.entryDesc}>{entry.description}</Text>
        <View style={styles.entryMeta}>
          <Text style={styles.entryTime}>{formatTime(entry.date)}</Text>
          <Badge
            label={getSourceLabel(entry.source)}
            color={c.green}
            bgColor={c.greenLight}
          />
        </View>
      </View>
      <Amount value={entry.amount} type={entry.type} size="md" />
    </Card>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    entryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 13,
      gap: 12,
      marginBottom: 8,
    },
    entryInfo: {
      flex: 1,
    },
    entryDesc: {
      fontSize: typography.base,
      fontWeight: '600',
      color: c.text,
    },
    entryMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
    },
    entryTime: {
      fontSize: typography.xs,
      color: c.textMuted,
    },
  });
}
