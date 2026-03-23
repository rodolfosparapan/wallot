import { Tabs, router } from 'expo-router'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
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
          overflow: 'visible',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#4ade80',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="entries"
        options={{
          title: 'Entries',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
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
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
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
