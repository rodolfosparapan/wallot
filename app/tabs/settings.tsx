import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore, useBudgetStore } from '@/store'
import { Colors, FontSizes, Spacing, Radius } from '@/constants/theme'

export default function Settings() {
  const { user, signOut } = useAuthStore()
  const { alerts, updateAlert } = useBudgetStore()

  const initials = user?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'WL'

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ])
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.full_name ?? 'Wallot User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>Free</Text>
          </View>
        </View>

        {/* Preferences */}
        <SettingsSection title="Preferences">
          <SettingsRow label="Language" value="Portuguese" onPress={() => {}} />
          <SettingsRow label="Currency" value="BRL R$" onPress={() => {}} />
          <SettingsRow label="Theme" value="Dark" onPress={() => {}} />
        </SettingsSection>

        {/* Finance */}
        <SettingsSection title="Finance">
          <SettingsRow
            label="Limits & Alerts"
            onPress={() => router.push('/tabs/limits')}
            arrow
          />
          <SettingsRow
            label="Categories"
            onPress={() => {}}
            arrow
          />
          <SettingsRow
            label="Connected accounts"
            value="Coming soon"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          {alerts.map((alert) => (
            <View key={alert.id} style={styles.alertRow}>
              <Text style={styles.alertLabel}>{formatAlertLabel(alert.type)}</Text>
              <Switch
                value={alert.enabled}
                onValueChange={(val) => updateAlert(alert.id, val)}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor="#fff"
              />
            </View>
          ))}
          {alerts.length === 0 && (
            <Text style={styles.emptyAlerts}>No alerts configured yet.</Text>
          )}
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account">
          <SettingsRow label="Privacy & data" onPress={() => {}} arrow />
          <SettingsRow label="Help & support" onPress={() => {}} arrow />
          <SettingsRow label="About Wallot" value="v1.0.0" onPress={() => {}} />
        </SettingsSection>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  )
}

function SettingsRow({
  label, value, onPress, arrow,
}: {
  label: string; value?: string; onPress: () => void; arrow?: boolean
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        {arrow && <Text style={styles.rowArrow}>›</Text>}
      </View>
    </TouchableOpacity>
  )
}

function formatAlertLabel(type: string): string {
  const labels: Record<string, string> = {
    daily_limit: 'Daily spending over limit',
    category_limit: 'Category limit at 80%',
    weekly_summary: 'Weekly AI summary',
    monthly_report: 'Monthly report',
  }
  return labels[type] ?? type
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.bg },
  userName: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary },
  userEmail: { fontSize: FontSizes.xs, color: Colors.textHint, marginTop: 2 },
  proBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: Colors.bgMid,
    borderRadius: Radius.full,
  },
  proBadgeText: { fontSize: FontSizes.xs, color: Colors.primary, fontWeight: '600' },
  section: { marginHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textHint,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowValue: { fontSize: FontSizes.sm, color: Colors.textHint },
  rowArrow: { fontSize: FontSizes.lg, color: Colors.border },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  alertLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, flex: 1 },
  emptyAlerts: { padding: Spacing.md, color: Colors.textHint, fontSize: FontSizes.sm },
  signOutBtn: {
    marginHorizontal: Spacing.lg,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#7f1d1d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: { color: Colors.expense, fontSize: FontSizes.md, fontWeight: '600' },
})
