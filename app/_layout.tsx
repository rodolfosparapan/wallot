import { useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { setSession, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)

        if (session?.user) {
          // Fetch user profile
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setUser(data)
          router.replace('/(tabs)')
        } else {
          setUser(null)
          // First launch (no session yet) → show onboarding; explicit sign-out → go to login
          router.replace(event === 'INITIAL_SESSION' ? '/auth/onboarding' : '/auth/login')
        }

        setLoading(false)
        SplashScreen.hideAsync()
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <StatusBar style="light" backgroundColor="#041208" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#041208' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="entry/add"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  )
}
