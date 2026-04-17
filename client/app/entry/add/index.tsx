import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { AITab } from '@/features/entry/AITab';
import { ManualTab } from '@/features/entry/ManualTab';
import { useAddEntryStyles } from '@/features/entry/AddEntry.styles';
import { useState } from 'react';

export default function AddEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const styles = useAddEntryStyles();
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={c.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Add Entry</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabWrap}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ai' && styles.tabActive]}
            onPress={() => setActiveTab('ai')}
          >
            <Ionicons
              name="sparkles"
              size={14}
              color={activeTab === 'ai' ? c.white : c.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'ai' && styles.tabTextActive]}>
              AI — Smart Entry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'manual' && styles.tabActive]}
            onPress={() => setActiveTab('manual')}
          >
            <Ionicons
              name="create"
              size={14}
              color={activeTab === 'manual' ? c.white : c.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'manual' && styles.tabTextActive]}>
              Manual
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'ai' ? <AITab /> : <ManualTab />}
    </View>
  );
}
