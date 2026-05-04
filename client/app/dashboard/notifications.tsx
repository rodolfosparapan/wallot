import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography, spacing, radius, shadows } from '@/constants/theme';
import { getNotifications, markRead, markAllRead, Notification } from '@/services/notificationService';
import { useThemeColors } from '@/hooks/useThemeColors';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = async () => {
    await markAllRead().catch(console.error);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleMarkRead = async (id: string) => {
    await markRead(id).catch(console.error);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  function iconForType(type: string): { icon: any; iconColor: string; iconBg: string } {
    switch (type) {
      case 'over_limit': return { icon: 'alert-circle', iconColor: c.red, iconBg: c.redLight };
      case 'budget_warnings': return { icon: 'warning', iconColor: '#b45309', iconBg: c.yellowLight };
      case 'weekly_summary': return { icon: 'stats-chart', iconColor: c.blue, iconBg: c.blueLight };
      default: return { icon: 'notifications', iconColor: c.green, iconBg: c.greenLight };
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={c.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markRead}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={c.green} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const { icon, iconColor, iconBg } = iconForType(item.type);
            return (
              <TouchableOpacity
                style={[styles.notifRow, !item.is_read && styles.notifRowUnread]}
                activeOpacity={0.7}
                onPress={() => handleMarkRead(item.id)}
              >
                <View style={[styles.notifIcon, { backgroundColor: iconBg }]}>
                  <Ionicons name={icon} size={20} color={iconColor} />
                </View>
                <View style={styles.notifBody}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifText}>{item.body}</Text>
                  <Text style={styles.notifTime}>{timeAgo(item.created_at)}</Text>
                </View>
                {!item.is_read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.lg, paddingVertical: 14, gap: spacing.md,
    },
    backBtn: {
      width: 40, height: 40, borderRadius: 14,
      backgroundColor: c.white, borderWidth: 1, borderColor: c.border,
      alignItems: 'center', justifyContent: 'center', ...shadows.sm,
    },
    pageTitle: { flex: 1, fontSize: typography.xl, fontWeight: '800', color: c.text },
    markRead: { fontSize: typography.sm, fontWeight: '600', color: c.green },
    list: { paddingHorizontal: spacing.lg },
    notifRow: {
      flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
      paddingVertical: spacing.base, backgroundColor: c.white,
      borderRadius: radius.base, padding: spacing.base,
      marginBottom: spacing.sm, borderWidth: 1, borderColor: c.border, ...shadows.sm,
    },
    notifRowUnread: { borderColor: c.greenLight, backgroundColor: c.greenSoft },
    notifIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    notifBody: { flex: 1, gap: 3 },
    notifTitle: { fontSize: typography.base, fontWeight: '700', color: c.text },
    notifText: { fontSize: typography.sm, color: c.textMid, lineHeight: 19 },
    notifTime: { fontSize: typography.xs, color: c.textMuted, marginTop: 2 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.green, marginTop: 4 },
    separator: { height: 0 },
  });
}
