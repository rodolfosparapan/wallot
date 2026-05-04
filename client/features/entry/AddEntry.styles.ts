import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { typography, spacing, radius, shadows } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

export function useAddEntryStyles() {
  const c = useThemeColors();
  return useMemo(() => StyleSheet.create({
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
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    pageTitle: {
      fontSize: typography.lg,
      fontWeight: '800',
      color: c.text,
    },
    tabWrap: {
      paddingHorizontal: spacing.lg,
      paddingBottom: 14,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: c.white,
      borderRadius: radius.lg,
      padding: 4,
      borderWidth: 1,
      borderColor: c.border,
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
      backgroundColor: c.greenDeep,
    },
    tabText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: c.textMuted,
    },
    tabTextActive: {
      color: c.white,
    },
    botAvatar: {
      width: 30,
      height: 30,
      borderRadius: 11,
      backgroundColor: c.greenDeep,
      alignItems: 'center',
      justifyContent: 'center',
    },
    msgRow: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'flex-end',
    },
    msgRowUser: {
      flexDirection: 'row-reverse',
    },
  }), [c]);
}
