import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';

function TabBarIcon({ name, label, focused }: { name: keyof typeof Ionicons.glyphMap; label: string; focused: boolean }) {
  const c = useThemeColors();
  return (
    <View style={styles.tabIconWrap}>
      <Ionicons name={name} size={22} color={focused ? c.greenDark : c.textMuted} />
      <Text style={[styles.tabLabel, { color: focused ? c.greenDark : c.textDim }]} numberOfLines={1}>{label}</Text>
      {focused && <View style={[styles.activeDot, { backgroundColor: c.greenMid }]} />}
    </View>
  );
}

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            backgroundColor: c.white,
            borderTopWidth: 1,
            borderTopColor: c.border,
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingTop: 8,
            ...shadows.sm,
          },
          { paddingBottom: Math.max(insets.bottom, 8) },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon name="home" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="entries"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon name="list" label="Entries" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: c.greenDeep }]}
              onPress={() => router.push('/entry/add')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={28} color={c.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon name="bulb" label="Ask AI" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon name="settings" label="Settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 60,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    ...shadows.green,
  },
});
