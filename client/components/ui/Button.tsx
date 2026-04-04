import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, typography } from '@/constants/theme';

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
    primary: { bg: colors.greenDeep, text: colors.white },
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

const styles = StyleSheet.create({
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
});
