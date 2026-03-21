# Wallot — Asset Pack
## Your wallet, a lot smarter.

All assets are in **SVG format** — scalable to any size, ready for React Native, Figma, Adobe XD, or any design tool.

---

## Folder Structure

```
wallot-assets/
├── logo/
│   ├── logo-dark.svg         Full logo — for dark backgrounds
│   ├── logo-light.svg        Full logo — for light backgrounds
│   ├── logo-icon.svg         Icon only — wallet with wings
│   ├── logo-wordmark.svg     Wordmark only — "Wallot"
│   └── logo-mono.svg         Monochrome — single green color
│
├── app-icons/
│   ├── icon-1024.svg         App Store (iOS required)
│   ├── icon-512.svg          Google Play
│   ├── icon-256.svg
│   ├── icon-192.svg          Android adaptive icon
│   ├── icon-180.svg          iPhone @3x
│   ├── icon-120.svg          iPhone @2x
│   ├── icon-76.svg           iPad
│   ├── icon-64.svg
│   ├── icon-48.svg
│   ├── icon-32.svg
│   └── favicon-32.svg        Web favicon
│
├── splash/
│   ├── splash-portrait.svg   iPhone 14 Pro Max (1284x2778)
│   └── splash-landscape.svg  Landscape (2778x1284)
│
├── buttons/
│   ├── btn-primary.svg       Primary CTA button
│   ├── btn-ghost.svg         Secondary/ghost button
│   ├── btn-danger.svg        Destructive action button
│   ├── btn-fab-add.svg       Floating action button (+)
│   ├── btn-voice.svg         Voice record button
│   ├── btn-photo.svg         Camera/photo button
│   ├── btn-send.svg          Send/submit button
│   ├── btn-google.svg        Google login button
│   └── btn-apple.svg         Apple login button
│
├── icons/
│   ├── ic-home.svg           Home tab
│   ├── ic-entries.svg        Entries tab
│   ├── ic-insights.svg       Insights tab
│   ├── ic-settings.svg       Settings tab
│   ├── ic-add.svg            Add entry
│   ├── ic-voice.svg          Microphone
│   ├── ic-camera.svg         Camera
│   ├── ic-income.svg         Income indicator
│   ├── ic-expense.svg        Expense indicator
│   ├── ic-food.svg           Food category
│   ├── ic-housing.svg        Housing category
│   ├── ic-transport.svg      Transport category
│   ├── ic-health.svg         Health category
│   ├── ic-shopping.svg       Shopping category
│   ├── ic-alert.svg          Alert/warning
│   ├── ic-chart.svg          Chart/analytics
│   ├── ic-back.svg           Back navigation
│   ├── ic-close.svg          Close/dismiss
│   └── ic-check.svg          Success checkmark
│
├── onboarding/
│   ├── ob-voice.svg          Slide 1 — voice illustration
│   ├── ob-photo.svg          Slide 2 — photo illustration
│   └── ob-ai.svg             Slide 3 — AI illustration
│
├── colors/
│   └── color-palette.svg     Full color system reference
│
└── ui-components/
    └── components-preview.svg  UI components reference sheet
```

---

## Brand Colors

| Name | Hex | Usage |
|---|---|---|
| Primary | `#22c55e` | Buttons, accents, active states |
| Dark | `#052e0f` | Main background |
| BG Card | `#0a1f0e` | Card backgrounds |
| BG Elevated | `#0a4d1c` | Hero cards |
| Border | `#0f5c22` | Borders, dividers |
| Text Primary | `#ffffff` | Main text |
| Text Secondary | `#d1fae5` | Body text |
| Text Muted | `#86efac` | Labels, hints |
| Expense | `#f87171` | Negative amounts |
| Warning | `#fbbf24` | Alerts |

## How to use in React Native

```tsx
import { SvgXml } from 'react-native-svg'
import logoSvg from '@/assets/logo/logo-dark.svg'

<SvgXml xml={logoSvg} width={200} height={60} />
```

Or convert to PNG using:
```bash
npx @svgr/cli --native logo-dark.svg
```
