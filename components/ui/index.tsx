import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Colors, Radius, Spacing, FontSizes } from '@/constants/theme'

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps {
  label: string
  onPress: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
}: ButtonProps) {
  const bg =
    variant === 'primary'
      ? Colors.primary
      : variant === 'danger'
      ? '#7f1d1d'
      : 'transparent'

  const textColor =
    variant === 'primary'
      ? Colors.bg
      : variant === 'danger'
      ? Colors.expense
      : Colors.textMuted

  const borderColor =
    variant === 'ghost' ? Colors.border : 'transparent'

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: bg, borderColor, borderWidth: variant === 'ghost' ? 1 : 0, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  elevated?: boolean
}

export function Card({ children, style, elevated }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && { backgroundColor: Colors.bgElevated, borderColor: Colors.borderStrong },
        style,
      ]}
    >
      {children}
    </View>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string
  color?: string
  textColor?: string
}

export function Badge({ label, color = Colors.bgCard, textColor = Colors.textMuted }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  )
}

// ── Amount display ────────────────────────────────────────────────────────────
interface AmountProps {
  value: number
  type?: 'income' | 'expense' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
}

export function Amount({ value, type = 'neutral', size = 'md' }: AmountProps) {
  const color =
    type === 'income' ? Colors.income : type === 'expense' ? Colors.expense : Colors.textPrimary
  const fontSize = size === 'sm' ? FontSizes.sm : size === 'lg' ? FontSizes.xxl : FontSizes.lg
  const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : ''

  return (
    <Text style={{ color, fontSize, fontWeight: '700' }}>
      {prefix}R$ {Math.abs(value).toFixed(2)}
    </Text>
  )
}

// ── Section title ─────────────────────────────────────────────────────────────
export function SectionTitle({ title, style }: { title: string; style?: TextStyle }) {
  return (
    <Text style={[styles.sectionTitle, style]}>{title.toUpperCase()}</Text>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textHint,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
})
