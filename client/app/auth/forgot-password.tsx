import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }
    setSent(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Forgot password</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {sent ? (
          <View style={styles.successState}>
            <View style={styles.successIcon}>
              <Ionicons name="mail-open" size={36} color={colors.green} />
            </View>
            <Text style={styles.successTitle}>Check your inbox</Text>
            <Text style={styles.successBody}>
              We sent a reset link to{'\n'}<Text style={{ fontWeight: '700', color: colors.text }}>{email}</Text>
            </Text>
            <TouchableOpacity style={styles.backToLogin} onPress={() => router.replace('/auth/login')}>
              <Text style={styles.backToLoginText}>Back to sign in</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.iconWrap}>
              <Ionicons name="lock-open" size={32} color={colors.green} />
            </View>
            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a link to reset your password.
            </Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={colors.textDim}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
              <Text style={styles.sendBtnText}>Send reset link</Text>
              <Ionicons name="send" size={16} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelLink} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Back to sign in</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', ...shadows.sm,
  },
  pageTitle: { fontSize: typography.lg, fontWeight: '800', color: colors.text },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 40, gap: spacing.lg },
  iconWrap: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: typography.xl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: typography.base, color: colors.textMuted, lineHeight: 22 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, borderRadius: radius.base,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.base, height: 52, ...shadows.sm,
  },
  input: { flex: 1, fontSize: typography.base, color: colors.text },
  sendBtn: {
    backgroundColor: colors.green, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingVertical: spacing.base, borderRadius: radius.base, ...shadows.green,
  },
  sendBtnText: { color: colors.white, fontSize: typography.md, fontWeight: '700' },
  cancelLink: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { fontSize: typography.base, color: colors.textMuted, fontWeight: '600' },
  successState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingBottom: 80 },
  successIcon: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { fontSize: typography.xl, fontWeight: '800', color: colors.text },
  successBody: { fontSize: typography.base, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  backToLogin: {
    backgroundColor: colors.green, paddingHorizontal: 32, paddingVertical: spacing.base,
    borderRadius: radius.base, marginTop: spacing.sm, ...shadows.green,
  },
  backToLoginText: { color: colors.white, fontSize: typography.md, fontWeight: '700' },
});
