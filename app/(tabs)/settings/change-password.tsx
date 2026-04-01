import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSave = () => {
    if (!current || !next || !confirm) {
      Alert.alert('All fields required', 'Please fill in all password fields.');
      return;
    }
    if (next !== confirm) {
      Alert.alert('Passwords do not match', 'New password and confirmation must match.');
      return;
    }
    Alert.alert('Password updated', 'Your password has been changed successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        {[
          { label: 'Current password', value: current, setter: setCurrent },
          { label: 'New password', value: next, setter: setNext },
          { label: 'Confirm new password', value: confirm, setter: setConfirm },
        ].map(({ label, value, setter }) => (
          <View key={label} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setter}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={colors.textDim}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Update password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: 14,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', ...shadows.sm,
  },
  pageTitle: { fontSize: typography.lg, fontWeight: '800', color: colors.text },
  form: { padding: spacing.lg, gap: spacing.lg },
  fieldGroup: { gap: spacing.sm },
  fieldLabel: { fontSize: typography.sm, fontWeight: '600', color: colors.textMuted },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, borderRadius: radius.base,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.base, height: 52, ...shadows.sm,
  },
  input: { flex: 1, fontSize: typography.base, color: colors.text },
  saveBtn: {
    backgroundColor: colors.green, borderRadius: radius.base,
    paddingVertical: spacing.base, alignItems: 'center',
    marginTop: spacing.sm, ...shadows.green,
  },
  saveBtnText: { color: colors.white, fontSize: typography.md, fontWeight: '700' },
});
