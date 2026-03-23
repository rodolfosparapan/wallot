import { useState, useRef, useEffect } from 'react'
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { askInsights } from '@/lib/openai'
import { useFinancialContext, useMonthSummary, formatCurrency } from '@/hooks/useEntries'
import { Colors, FontSizes, Spacing, Radius } from '@/constants/theme'
import type { AIMessage } from '@/types'

const SUGGESTED = [
  'How much did I save this month?',
  'Which category can I reduce?',
  'Compare my last 2 months',
  'What are my spending habits?',
  'How can I save more?',
]

export default function Insights() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const context = useFinancialContext()
  const summary = useMonthSummary()
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Greeting with real data
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: `Hey! I've analysed your finances for this month. You've spent **${formatCurrency(summary.total_expenses)}** and earned **${formatCurrency(summary.total_income)}**. Ask me anything! 📊`,
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setInput('')

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)

    const reply = await askInsights(text, context)
    const aiMsg: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, aiMsg])
    setLoading(false)
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Ask Wallot</Text>

      {/* AI Summary card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>AI insight · this month</Text>
        <Text style={styles.summaryText}>
          Balance {formatCurrency(summary.balance)} · {summary.top_categories[0]?.category ?? 'no'} is your top expense
        </Text>
      </View>

      {/* Chat */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}
          >
            {msg.role === 'assistant' && <Text style={styles.tag}>WALLOT</Text>}
            <Text style={[styles.bubbleText, msg.role === 'user' && { color: '#fff' }]}>
              {msg.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.bubble, styles.bubbleAI]}>
            <Text style={styles.tag}>WALLOT</Text>
            <ActivityIndicator color={Colors.primary} size="small" />
          </View>
        )}

        {/* Suggestions */}
        {messages.length <= 1 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsLabel}>Suggested questions</Text>
            {SUGGESTED.map((q) => (
              <TouchableOpacity key={q} style={styles.suggestion} onPress={() => send(q)}>
                <Text style={styles.suggestionText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask Wallot anything..."
          placeholderTextColor={Colors.textHint}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send(input)}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
          onPress={() => send(input)}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginBottom: 4 },
  summaryText: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary, lineHeight: 22 },
  chatScroll: { flex: 1, paddingHorizontal: Spacing.lg },
  bubble: {
    maxWidth: '85%',
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bubbleAI: {
    backgroundColor: Colors.bgCard,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleUser: {
    backgroundColor: '#1a3a20',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  tag: { fontSize: 9, fontWeight: '700', color: Colors.primary, marginBottom: 3, letterSpacing: 1 },
  bubbleText: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  suggestions: { marginTop: Spacing.md },
  suggestionsLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textHint,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  suggestion: {
    padding: Spacing.sm,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  suggestionText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { color: Colors.bg, fontSize: FontSizes.lg, fontWeight: '700' },
})
