import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Switch,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography, categoryColors } from '@/constants/theme';

// ── Button ──
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  icon,
  style,
  textStyle,
  fullWidth,
}: ButtonProps) {
  const variantStyles = {
    primary: { bg: colors.green, text: colors.white },
    secondary: { bg: colors.white, text: colors.text },
    ghost: { bg: 'transparent', text: colors.textMid },
    danger: { bg: colors.redLight, text: colors.red },
  };
  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        { backgroundColor: v.bg },
        variant === 'secondary' && { borderWidth: 1, borderColor: colors.border },
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={styles.buttonInner}>
          {icon && <Ionicons name={icon} size={18} color={v.text} style={{ marginRight: 6 }} />}
          <Text style={[styles.buttonText, { color: v.text }, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Card ──
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export function Card({ children, style, elevated }: CardProps) {
  return (
    <View style={[styles.card, elevated && shadows.md, style]}>
      {children}
    </View>
  );
}

// ── Badge ──
interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color = colors.green, bgColor, size = 'sm' }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor || `${color}18`,
          paddingHorizontal: size === 'sm' ? 8 : 10,
          paddingVertical: size === 'sm' ? 3 : 5,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color, fontSize: size === 'sm' ? 10 : 12 }]}>
        {label}
      </Text>
    </View>
  );
}

// ── Amount ──
interface AmountProps {
  value: number;
  type?: 'income' | 'expense' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  currency?: string;
}

export function Amount({ value, type = 'neutral', size = 'md', currency = 'BRL' }: AmountProps) {
  const colorMap = {
    income: colors.green,
    expense: colors.red,
    neutral: colors.text,
  };
  const sizeMap = { sm: 13, md: 16, lg: 22, xl: 32 };
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);

  return (
    <Text
      style={{
        color: colorMap[type],
        fontSize: sizeMap[size],
        fontWeight: '700',
      }}
    >
      {type === 'expense' ? `- ${formatted}` : type === 'income' ? `+ ${formatted}` : formatted}
    </Text>
  );
}

// ── SectionTitle ──
interface SectionTitleProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, action, onAction }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Divider ──
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

// ── CategoryIcon ──
interface CategoryIconProps {
  category: string;
  size?: number;
}

export function CategoryIcon({ category, size = 40 }: CategoryIconProps) {
  const cat = categoryColors[category] || categoryColors.other;
  const iconSize = size * 0.5;

  return (
    <View
      style={[
        styles.categoryIcon,
        {
          width: size,
          height: size,
          borderRadius: size * 0.35,
          backgroundColor: cat.bg,
        },
      ]}
    >
      <Ionicons name={cat.icon as any} size={iconSize} color={cat.color} />
    </View>
  );
}

// ── ProgressBar ──
interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color = colors.green,
  height = 6,
  style,
}: ProgressBarProps) {
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(progress * 100, 100)}%`,
            backgroundColor: color,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

// ── FilterPill ──
interface FilterPillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function FilterPill({ label, active, onPress }: FilterPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.filterPill, active && styles.filterPillActive]}
    >
      <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Toggle Row ──
interface ToggleRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange?: (val: boolean) => void;
}

export function ToggleRow({
  icon,
  iconColor = colors.green,
  iconBg = colors.greenLight,
  label,
  description,
  value,
  onValueChange,
}: ToggleRowProps) {
  return (
    <View style={styles.toggleRow}>
      <View style={[styles.toggleIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description && <Text style={styles.toggleDesc}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e5e7eb', true: colors.greenLight }}
        thumbColor={value ? colors.green : '#f4f4f5'}
      />
    </View>
  );
}

// ── Settings Row ──
interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

export function SettingsRow({
  icon,
  iconColor = colors.textMid,
  iconBg = colors.greenSoft,
  label,
  value,
  onPress,
  danger,
}: SettingsRowProps) {
  return (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.toggleIcon, { backgroundColor: danger ? colors.redLight : iconBg }]}>
        <Ionicons name={icon} size={18} color={danger ? colors.red : iconColor} />
      </View>
      <Text style={[styles.settingsLabel, danger && { color: colors.red }]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {value && (
          <View style={styles.settingsValue}>
            <Text style={styles.settingsValueText}>{value}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Button
  button: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.base,
    fontWeight: '700',
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Badge
  badge: {
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // SectionTitle
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionAction: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.green,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  // CategoryIcon
  categoryIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ProgressBar
  progressTrack: {
    backgroundColor: colors.greenSoft,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {},

  // FilterPill
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: colors.greenDeep,
    borderColor: colors.greenDeep,
  },
  filterPillText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textMid,
  },
  filterPillTextActive: {
    color: colors.white,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.text,
  },
  toggleDesc: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Settings Row
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  settingsLabel: {
    flex: 1,
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.text,
  },
  settingsValue: {
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  settingsValueText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.greenMid,
  },
});
