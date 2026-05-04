import React, { useMemo } from 'react';
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
import { radius, shadows, typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const c = useThemeColors();

  const variantStyles = {
    primary: { bg: c.greenDeep, text: c.white },
    secondary: { bg: c.white, text: c.text },
    ghost: { bg: 'transparent', text: c.textMid },
    danger: { bg: c.redLight, text: c.red },
  };
  const v = variantStyles[variant];

  const styles = useMemo(() => makeStyles(), []);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        { backgroundColor: v.bg },
        variant === 'secondary' && { borderWidth: 1, borderColor: c.border },
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

function makeStyles() {
  return StyleSheet.create({
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
}
