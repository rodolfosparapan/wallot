import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/auth/onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="wallet" size={40} color={colors.greenLight} />
          </View>
        </View>
        <Text style={styles.brandName}>wallot</Text>
        <Text style={styles.tagline}>Your wallet, a lot smarter</Text>
      </Animated.View>

      <View style={styles.loaderWrap}>
        <View style={styles.loaderTrack}>
          <Animated.View style={[styles.loaderFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.loadingText}>Loading your finances...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greenDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoWrap: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: typography.base,
    color: colors.greenLight,
    marginTop: 6,
    fontWeight: '500',
  },
  loaderWrap: {
    position: 'absolute',
    bottom: 80,
    left: 60,
    right: 60,
    alignItems: 'center',
  },
  loaderTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    backgroundColor: colors.green,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 12,
  },
});
