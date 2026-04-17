import React, { useMemo, useRef, useState } from 'react';
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
import { typography, spacing, radius, shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    titleParts: [{ text: 'Just ' }, { text: 'talk', accent: true }, { text: ' or type naturally' }],
    description:
      'Say "lunch R$87" or snap a receipt — Wallot\'s AI logs everything automatically. No forms, no friction.',
    bgColor: '#f0fdf4',
    accentColor: '#16a34a',
    icon: 'mic' as const,
    bubbleText: '🍕 Lunch R$87',
    pillText: 'Logged! R$87',
    pillBg: '#dcfce7',
    pillTextColor: '#166534',
    step: '01 / 03',
  },
  {
    id: '2',
    titleParts: [{ text: 'Snap a receipt, ' }, { text: 'done', accent: true }],
    description:
      'GPT-4o Vision reads your receipts instantly — amount, store, category, all extracted automatically.',
    bgColor: '#fefce8',
    accentColor: '#d97706',
    icon: 'camera' as const,
    bubbleText: '📷 Receipt scanned',
    pillText: 'R$213,45 · Food',
    pillBg: '#fef3c7',
    pillTextColor: '#92400e',
    step: '02 / 03',
  },
  {
    id: '3',
    titleParts: [{ text: 'Your ' }, { text: 'AI financial', accent: true }, { text: ' advisor' }],
    description:
      'Ask anything about your money. Wallot gives smart insights, budget alerts and tips — all powered by GPT-4o.',
    bgColor: '#eff6ff',
    accentColor: '#6366f1',
    icon: 'star' as const,
    bubbleText: '💡 Food up +23%',
    pillText: 'Score 72 · Good',
    pillBg: '#eff6ff',
    pillTextColor: '#4338ca',
    step: '03 / 03',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
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
        <View style={[styles.iconCircle, { backgroundColor: `${item.accentColor}20` }]}>
          <Ionicons name={item.icon} size={36} color={item.accentColor} />
        </View>
        <View style={[styles.chatBubble, { backgroundColor: c.white }]}>
          <Text style={[styles.chatBubbleText, { color: c.text }]}>{item.bubbleText}</Text>
        </View>
        <View style={[styles.confirmPill, { backgroundColor: item.pillBg, borderColor: `${item.accentColor}30` }]}>
          <Ionicons name="checkmark" size={13} color={item.pillTextColor} />
          <Text style={[styles.confirmPillText, { color: item.pillTextColor }]}>{item.pillText}</Text>
        </View>
      </View>
      <Text style={styles.stepNum}>{item.step}</Text>
      <Text style={styles.slideTitle}>
        {item.titleParts.map((part, i) =>
          part.accent ? (
            <Text key={i} style={{ color: c.greenMid }}>{part.text}</Text>
          ) : (
            <Text key={i}>{part.text}</Text>
          )
        )}
      </Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
                { backgroundColor: c.textDim },
                i === currentIndex && { ...styles.dotActive, backgroundColor: c.greenDeep },
              ]}
            />
          ))}
        </View>
        <View style={styles.btnRow}>
          {currentIndex < slides.length - 1 && (
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.nextBtn, currentIndex === slides.length - 1 && styles.getStartedBtn]} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>
              {currentIndex === slides.length - 1 ? 'Get started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={c.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    slide: {
      paddingHorizontal: spacing.xxl,
      paddingTop: 60,
    },
    illustrationCard: {
      width: 260,
      height: 260,
      borderRadius: 36,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
      position: 'relative',
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chatBubble: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      position: 'absolute',
      top: 30,
      left: 16,
      ...shadows.sm,
    },
    chatBubbleText: {
      fontSize: typography.base,
      fontWeight: '600',
    },
    confirmPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      position: 'absolute',
      bottom: 36,
      right: 10,
    },
    confirmPillText: {
      fontWeight: '700',
      fontSize: 12,
    },
    stepNum: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textDim,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
    },
    slideTitle: {
      fontSize: 30,
      fontWeight: '800',
      color: c.text,
      lineHeight: 34,
      letterSpacing: -0.5,
      marginBottom: 12,
    },
    slideDescription: {
      fontSize: typography.base,
      color: c.textMuted,
      lineHeight: 24,
      fontWeight: '500',
    },
    footer: {
      paddingHorizontal: spacing.xxl,
      gap: 20,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    dotActive: {
      width: 24,
    },
    btnRow: {
      flexDirection: 'row',
      gap: 10,
    },
    skipBtn: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderRadius: radius.lg,
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipText: {
      fontSize: typography.base,
      color: c.textMuted,
      fontWeight: '700',
    },
    nextBtn: {
      flex: 1,
      backgroundColor: c.greenDeep,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
      borderRadius: radius.lg,
      ...shadows.green,
    },
    getStartedBtn: {
      backgroundColor: c.green,
    },
    nextBtnText: {
      color: c.white,
      fontSize: typography.base,
      fontWeight: '800',
    },
  });
}
