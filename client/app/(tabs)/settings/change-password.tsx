import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography, spacing, radius, shadows } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
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
          <Ionicons name="chevron-back" size={20} color={c.textMid} />
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
              <Ionicons name="lock-closed" size={18} color={c.textMuted} />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setter}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={c.textDim}
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

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: spacing.lg, paddingVertical: 14,
    },
    backBtn: {
      width: 40, height: 40, borderRadius: 14,
      backgroundColor: c.white, borderWidth: 1, borderColor: c.border,
      alignItems: 'center', justifyContent: 'center', ...shadows.sm,
    },
    pageTitle: { fontSize: typography.lg, fontWeight: '800', color: c.text },
    form: { padding: spacing.lg, gap: spacing.lg },
    fieldGroup: { gap: spacing.sm },
    fieldLabel: { fontSize: typography.sm, fontWeight: '600', color: c.textMuted },
    inputWrap: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      backgroundColor: c.white, borderRadius: radius.base,
      borderWidth: 1, borderColor: c.border,
      paddingHorizontal: spacing.base, height: 52, ...shadows.sm,
    },
    input: { flex: 1, fontSize: typography.base, color: c.text },
    saveBtn: {
      backgroundColor: c.green, borderRadius: radius.base,
      paddingVertical: spacing.base, alignItems: 'center',
      marginTop: spacing.sm, ...shadows.green,
    },
    saveBtnText: { color: c.white, fontSize: typography.md, fontWeight: '700' },
  });
}
