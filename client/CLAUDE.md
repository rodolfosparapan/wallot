# Wallot Client

React Native mobile app built with Expo and expo-router.

## Stack

- **Framework**: React Native 0.81 + Expo 54
- **Routing**: expo-router (file-based, in `app/`)
- **State**: Zustand (`stores/`)
- **Language**: TypeScript (strict)
- **Icons**: @expo/vector-icons
- **Animations**: react-native-reanimated

## Project layout

```
client/
  app/                  # Routes (expo-router)
    (tabs)/             # Bottom tab screens
    auth/               # Login, onboarding, forgot-password
    dashboard/          # Notifications, search
    entry/              # Add entry flow
  components/ui/        # Shared UI primitives (Button, Card, Badge, etc.)
  features/             # Feature-scoped components (dashboard, entry, settings)
  constants/            # Theme, categories
  hooks/                # Custom hooks
  lib/                  # API client (lib/api.ts)
  services/             # Auth, alerts
  stores/               # Zustand stores
  types/                # Shared TypeScript types
  data/mock.ts          # Mock data for development
```

## Running

```bash
cd client
npx expo start          # opens Expo dev tools
npx expo start --android
npx expo start --ios
```

## Conventions

- UI primitives live in `components/ui/` and are re-exported from `components/ui/index.tsx`
- Feature components live in `features/<feature>/`
- API calls go through `lib/api.ts`
- Use Zustand stores for global state; keep local state with `useState`
- Theme tokens are in `constants/theme.ts` — do not hardcode colors or spacing
