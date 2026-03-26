import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { Card, SettingsRow, ToggleRow, Divider, Button } from '@/components/ui';
import { mockUser } from '@/data/mock';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [incomeGoalVisible, setIncomeGoalVisible] = useState(false);
  const [fullName, setFullName] = useState(mockUser.full_name);
  const [email, setEmail] = useState(mockUser.email);
  const [incomeGoal, setIncomeGoal] = useState('8000');

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => router.replace('/auth/login') },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete account', 'This action cannot be undone. All your data will be permanently deleted.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => router.replace('/auth/login') },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Card */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={28} color="rgba(255,255,255,0.9)" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{fullName}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditProfileVisible(true)}>
              <Ionicons name="pencil" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferences</Text>
          <Card>
            <SettingsRow icon="language" label="Language" value="PT-BR" onPress={() => router.push('/settings/language')} />
            <Divider />
            <SettingsRow icon="cash" label="Currency" value="R$ BRL" onPress={() => router.push('/settings/currency')} />
            <Divider />
            <SettingsRow icon="calendar" label="Month start" value="Day 1" onPress={() => Alert.alert('Coming soon', 'Month start setting will be available soon.')} />
            <Divider />
            <ToggleRow icon="moon" label="Dark mode" value={darkMode} onValueChange={setDarkMode} />
          </Card>
        </View>

        {/* Finance */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Finance</Text>
          <Card>
            <SettingsRow icon="grid" label="Default categories" onPress={() => router.push('/settings/categories')} />
            <Divider />
            <SettingsRow icon="trending-up" label="Monthly income goal" value="R$8,000" onPress={() => setIncomeGoalVisible(true)} />
            <Divider />
            <SettingsRow icon="download" label="Export data" value="CSV/PDF" onPress={() => Alert.alert('Coming soon', 'Data export will be available soon.')} />
            <Divider />
            <SettingsRow icon="alert-circle" iconColor={colors.yellow} label="Limits & Alerts" onPress={() => router.push('/limits')} />
          </Card>
        </View>

        {/* AI & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AI & Privacy</Text>
          <Card>
            <ToggleRow icon="sparkles" iconColor={colors.green} iconBg={colors.greenLight} label="AI suggestions" value={aiSuggestions} onValueChange={setAiSuggestions} />
            <Divider />
            <SettingsRow icon="shield-checkmark" label="Data & privacy policy" onPress={() => Alert.alert('Privacy policy', 'Your data is stored securely and never sold to third parties.')} />
          </Card>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <Card>
            <SettingsRow icon="key" label="Change password" onPress={() => router.push('/settings/change-password')} />
            <Divider />
            <SettingsRow icon="log-out" label="Sign out" danger onPress={handleSignOut} />
            <Divider />
            <SettingsRow icon="trash" label="Delete account" danger onPress={handleDeleteAccount} />
          </Card>
        </View>

        <Text style={styles.footer}>Wallot v1.0.0 · Made with ♥ in Brazil</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Full name</Text>
              <TextInput style={styles.modalInput} value={fullName} onChangeText={setFullName} />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Email</Text>
              <TextInput style={styles.modalInput} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="secondary" onPress={() => setEditProfileVisible(false)} style={{ flex: 1 }} />
              <Button title="Save" onPress={() => setEditProfileVisible(false)} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Income Goal Modal */}
      <Modal visible={incomeGoalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Monthly Income Goal</Text>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Amount (R$)</Text>
              <TextInput style={styles.modalInput} value={incomeGoal} onChangeText={setIncomeGoal} keyboardType="decimal-pad" />
            </View>
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="secondary" onPress={() => setIncomeGoalVisible(false)} style={{ flex: 1 }} />
              <Button title="Save" onPress={() => setIncomeGoalVisible(false)} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  pageTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.text,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  profileCard: {
    backgroundColor: colors.greenDeep,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...shadows.green,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  profileName: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colors.white,
  },
  profileEmail: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center',
    fontSize: typography.sm,
    color: colors.textDim,
    paddingVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colors.text,
  },
  modalField: {
    gap: spacing.sm,
  },
  modalLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  modalInput: {
    backgroundColor: colors.bg,
    borderRadius: radius.base,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    height: 48,
    fontSize: typography.base,
    color: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
