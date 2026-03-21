import { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native'
import { router } from 'expo-router'
import { Colors, FontSizes, Spacing, Radius } from '@/constants/theme'

const { width } = Dimensions.get('window')

const slides = [
  {
    emoji: '🎙️',
    title: 'Just talk to Wallot',
    subtitle: 'Send a voice message and Wallot automatically identifies the value, type and category of the entry.',
  },
  {
    emoji: '📸',
    title: 'Snap a receipt',
    subtitle: 'Take a photo of any receipt or bill. Wallot reads it and logs the entry instantly with AI.',
  },
  {
    emoji: '📊',
    title: 'AI does the rest',
    subtitle: 'Get smart reports, insights and budget alerts — all generated automatically by Wallot AI.',
  },
]

export default function Onboarding() {
  const [current, setCurrent] = useState(0)
  const slide = slides[current]
  const isLast = current === slides.length - 1

  const next = () => {
    if (isLast) {
      router.replace('/auth/login')
    } else {
      setCurrent((c) => c + 1)
    }
  }

  return (
    <View style={styles.container}>
      {/* Skip */}
      <TouchableOpacity style={styles.skip} onPress={() => router.replace('/auth/login')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View style={styles.illustration}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === current && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.btn} onPress={next}>
        <Text style={styles.btnText}>{isLast ? 'Get started' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  skip: {
    alignSelf: 'flex-end',
    padding: Spacing.sm,
  },
  skipText: {
    color: Colors.textHint,
    fontSize: FontSizes.sm,
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgElevated,
    width: '100%',
    borderRadius: Radius.xl,
    marginVertical: Spacing.xl,
  },
  emoji: {
    fontSize: 80,
  },
  content: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.primary,
  },
  btn: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: Colors.bg,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
})
