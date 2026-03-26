import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabBarIcon({ name, focused }: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  return (
    <View style={styles.tabIconWrap}>
      <Ionicons name={name} size={24} color={focused ? colors.green : colors.textDim} />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: Math.max(insets.bottom, 8) },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="entries"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon name="list" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.fab}
              onPress={() => router.push('/entry/add')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={28} color={colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon name="stats-chart" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 8,
    ...shadows.sm,
  },
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.green,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    ...shadows.green,
  },
});
