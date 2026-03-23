# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Wallot** is an AI-powered financial tracking app built with React Native and Expo. Users can log expenses and income via voice, photo, text, or manual input, with automatic categorization powered by OpenAI.

## Development Commands

```bash
# Start development server
npm start

# Start on specific platform
npm run android
npm run ios
npm run web
```

No lint or test scripts are configured. For production builds, use EAS CLI (`eas build --platform ios|android`).

## Environment Variables

Create a `.env` file in the root:
```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EXPO_PUBLIC_OPENAI_API_KEY=sk-your_openai_key_here
```

Run `supabase_schema.sql` in the Supabase SQL editor to set up the database.

## Architecture

### Navigation (Expo Router — file-based)
- `app/_layout.tsx` — Root layout; listens to Supabase auth state and redirects accordingly
- `app/index.tsx` — Auth redirect logic (loading state)
- `app/auth/` — Onboarding, login, register screens
- `app/tabs/` — Main app (dashboard, entries list, AI insights, settings)
- `app/entry/add.tsx` — Add entry modal

### State Management (Zustand — `store/index.ts`)
Three stores: `useAuthStore` (user/session), `useEntriesStore` (CRUD + caching), `useBudgetStore` (limits + alerts).

### Backend
- **Supabase** (`lib/supabase.ts`) — Auth + PostgreSQL with RLS. Tables: `users`, `entries`, `budget_limits`, `alerts`. Auto-creates user profile and default alerts via DB triggers on signup.
- **OpenAI** (`lib/openai.ts`) — Four functions: `parseTextEntry` (GPT-4o), `transcribeAudio` (Whisper-1), `parseReceiptImage` (GPT-4o Vision), `askInsights` (GPT-4o chat with financial context).

### Key Directories
- `components/ui/index.tsx` — Shared UI primitives (Button, Card, SectionTitle, etc.)
- `constants/theme.ts` — Design tokens: colors, fonts, spacing, category color map
- `hooks/useEntries.ts` — `useMonthSummary()`, `formatCurrency()`, `useFinancialContext()`
- `types/index.ts` — TypeScript interfaces for Entry, User, BudgetLimit, Alert

### Path Alias
`@/*` maps to the project root (configured in `tsconfig.json`).
