import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography, spacing, shadows } from '@/constants/theme';
import { Card } from '@/components/ui';
import { updateMe } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';
import { useThemeColors } from '@/hooks/useThemeColors';

const languages = [
  { code: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', label: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuthStore();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [selected, setSelected] = useState(user?.language ?? 'pt-BR');

  const handleSelect = (code: string) => {
    setSelected(code);
    updateMe({ language: code }).then(setUser).catch(() => {});
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={c.textMid} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Language</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Card>
          {languages.map((lang, i) => (
            <View key={lang.code}>
              <TouchableOpacity
                style={styles.langRow}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={styles.langLabel}>{lang.label}</Text>
                {selected === lang.code && (
                  <Ionicons name="checkmark-circle" size={22} color={c.green} />
                )}
              </TouchableOpacity>
              {i < languages.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </View>
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: spacing.lg, paddingVertical: 14,
    },
    backBtn: {
      width: 40, height: 40, borderRadius: 14,
      backgroundColor: c.white, borderWidth: 1, borderColor: c.border,
      alignItems: 'center', justifyContent: 'center', ...shadows.sm,
    },
    pageTitle: { fontSize: typography.lg, fontWeight: '800', color: c.text },
    content: { padding: spacing.lg },
    langRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14 },
    flag: { fontSize: 22 },
    langLabel: { flex: 1, fontSize: typography.base, fontWeight: '600', color: c.text },
    divider: { height: 1, backgroundColor: c.border },
  });
}
