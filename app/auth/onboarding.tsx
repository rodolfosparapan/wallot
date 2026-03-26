import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Just talk or type naturally',
    description:
      'Tell Wallot what you spent — by voice, text, or photo. Our AI understands and logs it instantly.',
    bgColor: colors.greenDeep,
    accentColor: colors.green,
    icon: 'mic' as const,
    bubbleText: '🍕 Lunch R$87',
    pillText: 'Logged! R$87',
    pillColor: colors.green,
  },
  {
    id: '2',
    title: 'Snap a receipt, done',
    description:
      'Point your camera at any receipt. GPT-4o Vision reads the total, merchant, and category for you.',
    bgColor: '#78350f',
    accentColor: '#f59e0b',
    icon: 'camera' as const,
    bubbleText: '📷 Receipt scanned',
    pillText: 'R$213,45 · Food',
    pillColor: '#f59e0b',
  },
  {
    id: '3',
    title: 'Your AI financial advisor',
    description:
      'Get smart insights, budget alerts, and a financial health score — all powered by AI.',
    bgColor: '#1e3a5f',
    accentColor: '#3b82f6',
    icon: 'star' as const,
    bubbleText: '💡 Food up +23%',
    pillText: 'Score 72 · Good',
    pillColor: '#3b82f6',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/auth/login');
    }
  };

  const handleSkip = () => {
    router.replace('/auth/login');
  };

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.illustrationCard, { backgroundColor: item.bgColor }]}>
        <View style={[styles.iconCircle, { backgroundColor: `${item.accentColor}30` }]}>
          <Ionicons name={item.icon} size={36} color={item.accentColor} />
        </View>
        <View style={styles.chatBubble}>
          <Text style={styles.chatBubbleText}>{item.bubbleText}</Text>
        </View>
        <View style={[styles.confirmPill, { backgroundColor: item.pillColor }]}>
          <Ionicons name="checkmark-circle" size={14} color={colors.white} />
          <Text style={styles.confirmPillText}>{item.pillText}</Text>
        </View>
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.nextBtnText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: typography.base,
    color: colors.textMuted,
    fontWeight: '600',
  },
  slide: {
    paddingHorizontal: spacing.xl,
    paddingTop: 32,
    alignItems: 'center',
  },
  illustrationCard: {
    width: '100%',
    height: 340,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    ...shadows.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  chatBubble: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    marginBottom: 12,
    ...shadows.sm,
  },
  chatBubbleText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.text,
  },
  confirmPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  confirmPillText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.sm,
  },
  slideTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDescription: {
    fontSize: typography.base,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textDim,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.green,
  },
  nextBtn: {
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: radius.base,
    ...shadows.green,
  },
  nextBtnText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: '700',
  },
});
