import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={[styles.hero, { paddingTop: insets.top + 40 }]}>
          <View style={styles.heroLogoWrap}>
            <Ionicons name="wallet" size={28} color={colors.greenLight} />
          </View>
          <Text style={styles.heroTitle}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {isLogin
              ? 'Sign in to manage your finances'
              : 'Start tracking your finances with AI'}
          </Text>
        </View>

        <View style={styles.formSection}>
          {/* Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                Create account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputWrap}>
                <View style={styles.inputIcon}>
                  <Ionicons name="person" size={18} color={colors.textMuted} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor={colors.textDim}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            )}

            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <Ionicons name="mail" size={18} color={colors.textMuted} />
              </View>
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

            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <Ionicons name="lock-closed" size={18} color={colors.textMuted} />
              </View>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor={colors.textDim}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {isLogin && (
              <TouchableOpacity style={styles.forgotLink}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
              <Text style={styles.submitText}>{isLogin ? 'Sign in' : 'Create account'}</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Ionicons name="logo-google" size={20} color={colors.text} />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Ionicons name="logo-apple" size={20} color={colors.text} />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    backgroundColor: colors.greenDeep,
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
  },
  heroLogoWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: typography.base,
    color: colors.greenLight,
    fontWeight: '500',
  },
  formSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.base,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.greenDeep,
  },
  tabText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.white,
  },
  form: {
    gap: 14,
    marginBottom: spacing.xl,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.base,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 52,
    ...shadows.sm,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: typography.base,
    color: colors.text,
  },
  eyeBtn: {
    padding: 6,
  },
  forgotLink: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: typography.sm,
    color: colors.green,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: radius.base,
    marginTop: 4,
    ...shadows.green,
  },
  submitText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: typography.sm,
    color: colors.textDim,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xl,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderRadius: radius.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  socialText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.text,
  },
  termsText: {
    fontSize: typography.xs,
    color: colors.textDim,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.green,
    fontWeight: '600',
  },
});
