# Wallot 🟢
### Your wallet, a lot smarter.

React Native + Expo app with AI-powered financial tracking via voice, photo and text.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 51) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Backend | Supabase (auth + database) |
| AI / Voice | OpenAI Whisper + GPT-4o |
| AI / Image | GPT-4o Vision |
| Styling | StyleSheet (NativeWind optional) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase_schema.sql`
3. Copy your **Project URL** and **anon public key**

### 3. Set up OpenAI

1. Get an API key at [platform.openai.com](https://platform.openai.com)
2. Make sure you have access to `gpt-4o` and `whisper-1`

### 4. Configure environment variables

Create a `.env` file in the root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EXPO_PUBLIC_OPENAI_API_KEY=sk-your_openai_key_here
```

### 5. Start the app

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press:
- `i` for iOS simulator
- `a` for Android emulator

---

## Project Structure

```
wallot/
├── app/
│   ├── _layout.tsx          # Root layout + auth routing
│   ├── index.tsx            # Redirect based on auth state
│   ├── auth/
│   │   ├── onboarding.tsx   # 3-slide intro
│   │   ├── login.tsx        # Sign in screen
│   │   └── register.tsx     # Sign up screen
│   ├── tabs/
│   │   ├── _layout.tsx      # Bottom tab navigator
│   │   ├── index.tsx        # Dashboard
│   │   ├── entries.tsx      # All entries + filters
│   │   ├── insights.tsx     # AI chat
│   │   └── settings.tsx     # Settings + alerts
│   └── entry/
│       └── add.tsx          # Add entry (manual + AI)
├── components/
│   └── ui/index.tsx         # Shared UI components
├── constants/
│   └── theme.ts             # Colors, spacing, categories
├── hooks/
│   └── useEntries.ts        # Summary calculations + context
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── openai.ts            # OpenAI helpers (voice, photo, chat)
├── store/
│   └── index.ts             # Zustand stores (auth, entries, budget)
├── types/
│   └── index.ts             # TypeScript types
└── supabase_schema.sql      # Run this in Supabase SQL editor
```

---

## Key Features

- **Voice entry** — record audio → Whisper transcribes → GPT-4o categorizes
- **Photo entry** — snap receipt → GPT-4o Vision reads it → auto-logged
- **Text entry** — type naturally → GPT-4o extracts amount + category
- **Manual entry** — classic form with category picker
- **Dashboard** — balance, income/expense stats, top 3 categories
- **Entries** — filterable + searchable list, grouped by date
- **Insights** — chat with AI about your finances
- **Settings** — profile, currency, language, alerts

---

## Build for App Stores

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## Next Steps

- [ ] WhatsApp integration (Twilio / WhatsApp Business API)
- [ ] Charts on insights screen (Victory Native)
- [ ] Budget limits screen
- [ ] Push notifications for alerts
- [ ] Google / Apple OAuth
- [ ] Currency conversion
- [ ] CSV export
- [ ] Widget for home screen (quick add)
