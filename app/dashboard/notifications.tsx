import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';

const mockNotifications = [
  {
    id: '1',
    icon: 'alert-circle' as const,
    iconColor: colors.red,
    iconBg: colors.redLight,
    title: 'Food budget exceeded',
    body: "You've spent R$816 on food this month, 2% over your R$800 limit.",
    time: '2h ago',
    read: false,
  },
  {
    id: '2',
    icon: 'warning' as const,
    iconColor: '#b45309',
    iconBg: colors.yellowLight,
    title: 'Transport near limit',
    body: "You've used 83% of your transport budget (R$581 of R$700).",
    time: '1d ago',
    read: false,
  },
  {
    id: '3',
    icon: 'checkmark-circle' as const,
    iconColor: colors.green,
    iconBg: colors.greenLight,
    title: 'Monthly salary received',
    body: 'R$8,200 has been added as income.',
    time: '2d ago',
    read: true,
  },
  {
    id: '4',
    icon: 'stats-chart' as const,
    iconColor: colors.blue,
    iconBg: colors.blueLight,
    title: 'Weekly summary ready',
    body: 'You spent R$845 this week. Food and transport were your top categories.',
    time: '3d ago',
    read: true,
  },
  {
    id: '5',
    icon: 'trending-up' as const,
    iconColor: colors.green,
    iconBg: colors.greenLight,
    title: 'Financial health improved',
    body: 'Your health score went up 8 points to 72. Keep it up!',
    time: '5d ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markRead}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifRow, !item.read && styles.notifRowUnread]}
            activeOpacity={0.7}
            onPress={() => setNotifications((prev) => prev.map((n) => n.id === item.id ? { ...n, read: true } : n))}
          >
            <View style={[styles.notifIcon, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={20} color={item.iconColor} />
            </View>
            <View style={styles.notifBody}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifText}>{item.body}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    gap: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  pageTitle: { flex: 1, fontSize: typography.xl, fontWeight: '800', color: colors.text },
  markRead: { fontSize: typography.sm, fontWeight: '600', color: colors.green },
  list: { paddingHorizontal: spacing.lg },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.base,
    backgroundColor: colors.white,
    borderRadius: radius.base,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  notifRowUnread: {
    borderColor: colors.greenLight,
    backgroundColor: colors.greenSoft,
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBody: { flex: 1, gap: 3 },
  notifTitle: { fontSize: typography.base, fontWeight: '700', color: colors.text },
  notifText: { fontSize: typography.sm, color: colors.textMid, lineHeight: 19 },
  notifTime: { fontSize: typography.xs, color: colors.textMuted, marginTop: 2 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginTop: 4,
  },
  separator: { height: 0 },
});
