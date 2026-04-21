import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { typography, spacing, radius, shadows } from '@/constants/theme';
import { WLogo } from '@/components/WLogo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { login, loginWithGoogle, register, toUser } from '@/services/authService';
import { getMe } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setAuth, setUser } = useAuthStore();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { request: googleRequest, response: googleResponse, promptAsync: googlePromptAsync, exchangeForIdToken } = useGoogleAuth();

  useEffect(() => {
    if (googleResponse?.type !== 'success') {
      if (googleResponse?.type === 'error') setError('Google sign-in was cancelled or failed.');
      return;
    }
    setLoading(true);
    exchangeForIdToken()
      .then(loginWithGoogle)
      .then((res) => {
        setAuth(res.token, toUser(res));
        getMe().then(setUser).catch(() => {});
        router.replace('/(tabs)');
      })
      .catch((err: any) => setError(err.message ?? 'Google sign-in failed.'))
      .finally(() => setLoading(false));
  }, [googleResponse]);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = isLogin
        ? await login(email.trim(), password)
        : await register(email.trim(), password, fullName.trim() || email.trim());
      setAuth(res.token, toUser(res));
      getMe().then(setUser).catch(() => {});
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
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
        <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
          <View style={styles.heroLogoRow}>
            <View style={styles.heroLogoWrap}>
              <WLogo size={20} color={c.green} />
            </View>
            <Text style={styles.heroLogoName}>wallot</Text>
          </View>
          <Text style={styles.heroTitle}>
            {isLogin ? 'Welcome back! 👋' : 'Create your account ✨'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {isLogin
              ? 'Sign in to your account to continue'
              : 'Start tracking smarter today'}
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
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Full name</Text>
                <View style={styles.inputWrap}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="person" size={17} color={c.textDim} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Jonathan Silva"
                    placeholderTextColor={c.textDim}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputWrap}>
                <View style={styles.inputIcon}>
                  <Ionicons name="mail" size={17} color={c.textDim} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={c.textDim}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <View style={styles.inputIcon}>
                  <Ionicons name="lock-closed" size={17} color={c.textDim} />
                </View>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={c.textDim}
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
                    color={c.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {isLogin && (
              <TouchableOpacity style={styles.forgotLink} onPress={() => router.push('/auth/forgot-password')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={c.white} />
              ) : (
                <>
                  <Text style={styles.submitText}>{isLogin ? 'Sign in' : 'Create account'}</Text>
                  <Ionicons name="arrow-forward" size={18} color={c.white} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialCol}>
            <TouchableOpacity
              style={styles.socialBtn}
              activeOpacity={0.7}
              disabled={!googleRequest || loading}
              onPress={() => { setError(null); googlePromptAsync(); }}
            >
              <Ionicons name="logo-google" size={20} color={c.text} />
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7} onPress={() => Alert.alert('Coming soon', 'Apple login will be available soon.')}>
              <Ionicons name="logo-apple" size={20} color={c.text} />
              <Text style={styles.socialText}>Continue with Apple</Text>
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

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    hero: {
      backgroundColor: c.greenDeep,
      paddingHorizontal: spacing.xl,
      paddingBottom: 36,
    },
    heroLogoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 20,
    },
    heroLogoWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroLogoName: {
      fontSize: 20,
      fontWeight: '800',
      color: c.white,
      letterSpacing: -0.5,
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: c.white,
      lineHeight: 32,
      marginBottom: 6,
    },
    heroSubtitle: {
      fontSize: typography.sm,
      color: 'rgba(187,247,208,0.6)',
      fontWeight: '500',
    },
    formSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: c.white,
      borderRadius: radius.lg,
      padding: 4,
      borderWidth: 1,
      borderColor: c.border,
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
      backgroundColor: c.greenDeep,
    },
    tabText: {
      fontSize: typography.sm,
      fontWeight: '700',
      color: c.textMuted,
    },
    tabTextActive: {
      color: c.white,
    },
    form: {
      gap: 12,
      marginBottom: spacing.xl,
    },
    field: {
      gap: 6,
    },
    fieldLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      paddingLeft: 2,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 16,
      height: 52,
      ...shadows.sm,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: typography.base,
      color: c.text,
    },
    eyeBtn: {
      padding: 6,
    },
    forgotLink: {
      alignSelf: 'flex-end',
    },
    forgotText: {
      fontSize: typography.sm,
      color: c.green,
      fontWeight: '600',
    },
    submitBtn: {
      backgroundColor: c.greenDeep,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
      borderRadius: radius.lg,
      marginTop: 4,
      ...shadows.green,
    },
    submitText: {
      color: c.white,
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
      backgroundColor: c.border,
    },
    dividerText: {
      fontSize: typography.sm,
      color: c.textDim,
      fontWeight: '500',
    },
    socialCol: {
      gap: 10,
      marginBottom: spacing.xl,
    },
    socialBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 14,
      backgroundColor: c.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      ...shadows.sm,
    },
    socialText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: c.text,
    },
    termsText: {
      fontSize: typography.xs,
      color: c.textDim,
      textAlign: 'center',
      lineHeight: 18,
    },
    termsLink: {
      color: c.green,
      fontWeight: '600',
    },
    errorBox: {
      backgroundColor: '#FEE2E2',
      borderRadius: radius.base,
      padding: 12,
    },
    errorText: {
      color: '#DC2626',
      fontSize: typography.sm,
      fontWeight: '500',
    },
  });
}
