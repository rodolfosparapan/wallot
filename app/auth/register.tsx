import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { Colors, FontSizes, Spacing, Radius } from '@/constants/theme'
import { Button } from '@/components/ui'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert('Check your email', 'We sent you a confirmation link.')
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoRow}>
        <Text style={styles.logoText}>
          Wal<Text style={{ color: Colors.primary }}>lot</Text>
        </Text>
      </View>

      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Free forever. No credit card needed.</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor={Colors.textHint}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={Colors.textHint}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.textHint}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button label="Create account" onPress={signUp} loading={loading} style={styles.btn} />

      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.socialText}>G  Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.socialText}> Apple</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()} style={styles.loginRow}>
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
  },
  logoRow: { marginBottom: Spacing.xl },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
  },
  btn: { marginTop: Spacing.md, marginBottom: Spacing.lg },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { color: Colors.textHint, fontSize: FontSizes.xs },
  socialRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  socialBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: { color: Colors.textMuted, fontSize: FontSizes.sm },
  loginRow: { alignItems: 'center' },
  loginText: { color: Colors.textHint, fontSize: FontSizes.sm },
})
