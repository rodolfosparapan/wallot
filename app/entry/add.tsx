import { useState, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Audio } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { format } from 'date-fns'
import { useAuthStore, useEntriesStore } from '@/store'
import { parseTextEntry, transcribeAudio, parseReceiptImage } from '@/lib/openai'
import { Colors, FontSizes, Spacing, Radius, Categories } from '@/constants/theme'
import { Button } from '@/components/ui'
import type { EntryType, Category } from '@/types'

type Tab = 'manual' | 'ai'
type AIMessage = { role: 'user' | 'assistant'; content: string; isLoading?: boolean }

export default function AddEntry() {
  const [tab, setTab] = useState<Tab>('ai')
  const { user } = useAuthStore()
  const { createEntry } = useEntriesStore()

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Entry</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'manual' && styles.tabActive]}
          onPress={() => setTab('manual')}
        >
          <Text style={[styles.tabText, tab === 'manual' && styles.tabTextActive]}>
            Manual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'ai' && styles.tabActive]}
          onPress={() => setTab('ai')}
        >
          <Text style={[styles.tabText, tab === 'ai' && styles.tabTextActive]}>
            AI — voice / photo
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'manual' ? (
        <ManualForm user={user} createEntry={createEntry} />
      ) : (
        <AIForm user={user} createEntry={createEntry} />
      )}
    </SafeAreaView>
  )
}

// ── Manual Form ───────────────────────────────────────────────────────────────
function ManualForm({ user, createEntry }: any) {
  const [type, setType] = useState<EntryType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('food')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const save = async () => {
    const parsed = parseFloat(amount.replace(',', '.'))
    if (!parsed || !description) {
      Alert.alert('Missing fields', 'Please fill in amount and description.')
      return
    }
    setLoading(true)
    await createEntry({
      user_id: user.id,
      type,
      amount: parsed,
      category,
      description,
      date: new Date().toISOString(),
      source: 'manual',
    })
    setLoading(false)
    router.back()
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>

        {/* Type selector */}
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpActive]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeBtnText, type === 'expense' && { color: Colors.expense }]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'income' && styles.typeBtnIncActive]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeBtnText, type === 'income' && { color: Colors.income }]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={[styles.input, styles.amountInput]}
          placeholder="R$ 0,00"
          placeholderTextColor={Colors.textHint}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.catGrid}>
          {Categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catPill, category === cat.id && styles.catPillActive]}
              onPress={() => setCategory(cat.id as Category)}
            >
              <Text style={[styles.catText, category === cat.id && styles.catTextActive]}>
                {cat.icon} {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Lunch at restaurant"
          placeholderTextColor={Colors.textHint}
          value={description}
          onChangeText={setDescription}
        />

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <View style={[styles.input, styles.dateRow]}>
          <Text style={{ color: Colors.textMuted }}>
            {format(new Date(), 'dd/MM/yyyy — HH:mm')}
          </Text>
        </View>

        <Button label="Save entry" onPress={save} loading={loading} style={styles.saveBtn} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

// ── AI Form ───────────────────────────────────────────────────────────────────
function AIForm({ user, createEntry }: any) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: "Hey! Send a voice message, snap a photo or just type what you spent. I'll take care of the rest! 🎙️📸",
    },
  ])
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  const addMsg = (msg: AIMessage) => {
    setMessages((prev) => [...prev, msg])
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  const processEntry = async (text: string, source: 'text' | 'voice' | 'photo') => {
    try {
      const parsed = await parseTextEntry(text)
      await createEntry({
        user_id: user.id,
        ...parsed,
        date: new Date().toISOString(),
        source,
      })
      return `Got it! Logged **${parsed.description}** — ${parsed.category} · R$${parsed.amount.toFixed(2)}. ✅`
    } catch {
      return "Sorry, I couldn't understand that. Please try again or use manual mode."
    }
  }

  const sendText = async () => {
    if (!input.trim() || aiLoading) return
    const text = input.trim()
    setInput('')
    addMsg({ role: 'user', content: text })
    setAiLoading(true)
    const reply = await processEntry(text, 'text')
    addMsg({ role: 'assistant', content: reply })
    setAiLoading(false)
  }

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true })
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      setRecording(recording)
      setIsRecording(true)
    } catch {
      Alert.alert('Error', 'Could not start recording.')
    }
  }

  const stopRecording = async () => {
    if (!recording) return
    setIsRecording(false)
    await recording.stopAndUnloadAsync()
    const uri = recording.getURI()
    setRecording(null)
    if (!uri) return

    addMsg({ role: 'user', content: '🎙️ Voice message sent' })
    setAiLoading(true)
    try {
      const transcript = await transcribeAudio(uri)
      const reply = await processEntry(transcript, 'voice')
      addMsg({ role: 'assistant', content: reply })
    } catch {
      addMsg({ role: 'assistant', content: "Couldn't process the audio. Try again!" })
    }
    setAiLoading(false)
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    })
    if (result.canceled || !result.assets[0]) return

    addMsg({ role: 'user', content: '📸 Receipt photo sent' })
    setAiLoading(true)
    try {
      const base64 = result.assets[0].base64 ?? ''
      const parsed = await parseReceiptImage(base64)
      await createEntry({
        user_id: user.id,
        ...parsed,
        date: new Date().toISOString(),
        source: 'photo',
      })
      addMsg({
        role: 'assistant',
        content: `Receipt scanned! Logged **${parsed.description}** · ${parsed.category} · R$${parsed.amount.toFixed(2)} ✅`,
      })
    } catch {
      addMsg({ role: 'assistant', content: "Couldn't read the receipt. Try a clearer photo!" })
    }
    setAiLoading(false)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI,
            ]}
          >
            {msg.role === 'assistant' && (
              <Text style={styles.bubbleTag}>WALLOT</Text>
            )}
            <Text style={[styles.bubbleText, msg.role === 'user' && { color: '#fff' }]}>
              {msg.content}
            </Text>
          </View>
        ))}
        {aiLoading && (
          <View style={[styles.bubble, styles.bubbleAI]}>
            <Text style={styles.bubbleTag}>WALLOT</Text>
            <ActivityIndicator color={Colors.primary} size="small" />
          </View>
        )}
      </ScrollView>

      {/* Input row */}
      <View style={styles.aiInputRow}>
        <TextInput
          style={styles.aiInput}
          placeholder="Type an entry..."
          placeholderTextColor={Colors.textHint}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendText}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.aiBtn, isRecording && { backgroundColor: Colors.expense }]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={{ fontSize: 16 }}>{isRecording ? '⏹' : '🎙️'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.aiBtn} onPress={pickImage}>
          <Text style={{ fontSize: 16 }}>📸</Text>
        </TouchableOpacity>
        {input.length > 0 && (
          <TouchableOpacity style={[styles.aiBtn, { backgroundColor: Colors.primary }]} onPress={sendText}>
            <Text style={{ fontSize: 14, color: Colors.bg, fontWeight: '700' }}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: Colors.textMuted, fontSize: FontSizes.lg },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.textPrimary },
  tabRow: {
    flexDirection: 'row',
    margin: Spacing.lg,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.sm,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.sm - 2,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSizes.sm, color: Colors.textHint, fontWeight: '600' },
  tabTextActive: { color: Colors.bg },
  form: { paddingHorizontal: Spacing.lg },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
  },
  amountInput: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    height: 56,
  },
  dateRow: {
    justifyContent: 'center',
  },
  typeRow: { flexDirection: 'row', gap: Spacing.sm },
  typeBtn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBtnExpActive: { borderColor: Colors.expense, backgroundColor: '#1f0a0a' },
  typeBtnIncActive: { borderColor: Colors.income, backgroundColor: '#0a1f0e' },
  typeBtnText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textHint },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  catPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  catPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  catTextActive: { color: Colors.bg, fontWeight: '700' },
  saveBtn: { marginTop: Spacing.xl },
  chatScroll: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  bubble: {
    maxWidth: '85%',
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bubbleAI: {
    backgroundColor: Colors.bgElevated,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#1a3a20',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 3,
    letterSpacing: 1,
  },
  bubbleText: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  aiInput: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    height: 42,
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
  },
  aiBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
