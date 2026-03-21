import { Redirect } from 'expo-router'
import { useAuthStore } from '@/store'
import { View, ActivityIndicator } from 'react-native'
import { Colors } from '@/constants/theme'

export default function Index() {
  const { session, loading } = useAuthStore()

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    )
  }

  return <Redirect href={session ? '/(tabs)' : '/auth/onboarding'} />
}
