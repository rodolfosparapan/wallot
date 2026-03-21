import { Tabs, router } from 'expo-router'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

function AddButton() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/entry/add')}
      style={styles.addBtn}
    >
      <View style={styles.addInner}>
        <View style={styles.plus} />
        <View style={styles.plusH} />
      </View>
    </TouchableOpacity>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#020a04',
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.bgMid,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon type="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="entries"
        options={{
          title: 'Entries',
          tabBarIcon: ({ color }) => <TabIcon type="entries" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: () => <AddButton />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <TabIcon type="insights" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon type="settings" color={color} />,
        }}
      />
    </Tabs>
  )
}

function TabIcon({ type, color }: { type: string; color: string }) {
  const size = 20
  // Simple SVG-like icons using View shapes
  if (type === 'home') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 14, height: 10, borderWidth: 1.5, borderColor: color, borderRadius: 2 }} />
      </View>
    )
  }
  if (type === 'entries') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 14, height: 14, borderWidth: 1.5, borderColor: color, borderRadius: 7 }} />
      </View>
    )
  }
  if (type === 'insights') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 14, height: 10, borderWidth: 1.5, borderColor: color, borderRadius: 2 }} />
      </View>
    )
  }
  // settings
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 12, height: 12, borderWidth: 1.5, borderColor: color, borderRadius: 6 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  addBtn: {
    top: -16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
  },
  addInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    position: 'absolute',
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: Colors.bg,
  },
  plusH: {
    position: 'absolute',
    width: 2.5,
    height: 20,
    borderRadius: 2,
    backgroundColor: Colors.bg,
  },
})
