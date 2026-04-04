import { StyleSheet } from 'react-native';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';

// Shared styles for AddEntry screen
export const styles = StyleSheet.create({
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
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 11,
    backgroundColor: colors.greenDeep,
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
});
