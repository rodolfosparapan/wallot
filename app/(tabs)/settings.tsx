import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { Card, SettingsRow, ToggleRow, Divider } from '@/components/ui';
import { mockUser } from '@/data/mock';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(true);

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
              <Ionicons name="person" size={28} color={colors.greenMid} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{mockUser.full_name}</Text>
              <Text style={styles.profileEmail}>{mockUser.email}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferences</Text>
          <Card>
            <SettingsRow icon="language" label="Language" value="PT-BR" />
            <Divider />
            <SettingsRow icon="cash" label="Currency" value="R$ BRL" />
            <Divider />
            <SettingsRow icon="calendar" label="Month start" value="Day 1" />
            <Divider />
            <ToggleRow
              icon="moon"
              label="Dark mode"
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </Card>
        </View>

        {/* Finance */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Finance</Text>
          <Card>
            <SettingsRow icon="grid" label="Default categories" />
            <Divider />
            <SettingsRow icon="trending-up" label="Monthly income goal" value="R$8,000" />
            <Divider />
            <SettingsRow icon="download" label="Export data" value="CSV/PDF" />
            <Divider />
            <SettingsRow
              icon="alert-circle"
              iconColor={colors.yellow}
              label="Limits & Alerts"
              onPress={() => router.push('/limits')}
            />
          </Card>
        </View>

        {/* AI & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AI & Privacy</Text>
          <Card>
            <ToggleRow
              icon="sparkles"
              iconColor={colors.green}
              iconBg={colors.greenLight}
              label="AI suggestions"
              value={aiSuggestions}
              onValueChange={setAiSuggestions}
            />
            <Divider />
            <SettingsRow icon="shield-checkmark" label="Data & privacy policy" />
          </Card>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <Card>
            <SettingsRow icon="key" label="Change password" />
            <Divider />
            <SettingsRow icon="log-out" label="Sign out" danger />
            <Divider />
            <SettingsRow icon="trash" label="Delete account" danger />
          </Card>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Wallot v1.0.0 · Made with ♥ in Brazil</Text>
      </ScrollView>
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
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
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
});
