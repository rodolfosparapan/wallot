import { create } from 'zustand'
import type { User, Entry, BudgetLimit, Alert } from '@/types'
import { supabase } from '@/lib/supabase'

// ── Auth Store ────────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  setUser: (user: User | null) => void
  setSession: (session: any) => void
  setLoading: (loading: boolean) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },
}))

// ── Entries Store ─────────────────────────────────────────────────────────────
interface EntriesState {
  entries: Entry[]
  loading: boolean
  setEntries: (entries: Entry[]) => void
  addEntry: (entry: Entry) => void
  removeEntry: (id: string) => void
  setLoading: (loading: boolean) => void
  fetchEntries: (userId: string) => Promise<void>
  createEntry: (entry: Omit<Entry, 'id' | 'created_at'>) => Promise<void>
}

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],
  loading: false,
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  removeEntry: (id) =>
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
  setLoading: (loading) => set({ loading }),

  fetchEntries: async (userId: string) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(100)

    if (!error && data) set({ entries: data })
    set({ loading: false })
  },

  createEntry: async (entry) => {
    const { data, error } = await supabase
      .from('entries')
      .insert(entry)
      .select()
      .single()

    if (!error && data) get().addEntry(data)
  },
}))

// ── Budget Store ──────────────────────────────────────────────────────────────
interface BudgetState {
  limits: BudgetLimit[]
  alerts: Alert[]
  setLimits: (limits: BudgetLimit[]) => void
  setAlerts: (alerts: Alert[]) => void
  fetchLimits: (userId: string) => Promise<void>
  updateAlert: (id: string, enabled: boolean) => Promise<void>
}

export const useBudgetStore = create<BudgetState>((set) => ({
  limits: [],
  alerts: [],
  setLimits: (limits) => set({ limits }),
  setAlerts: (alerts) => set({ alerts }),

  fetchLimits: async (userId: string) => {
    const [limitsRes, alertsRes] = await Promise.all([
      supabase.from('budget_limits').select('*').eq('user_id', userId),
      supabase.from('alerts').select('*').eq('user_id', userId),
    ])
    if (limitsRes.data) set({ limits: limitsRes.data })
    if (alertsRes.data) set({ alerts: alertsRes.data })
  },

  updateAlert: async (id: string, enabled: boolean) => {
    await supabase.from('alerts').update({ enabled }).eq('id', id)
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, enabled } : a)),
    }))
  },
}))
