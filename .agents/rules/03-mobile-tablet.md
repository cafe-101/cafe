# Mobile & Tablet Apps AI Rules (`apps/customer-mobile` & `apps/branch-tablet`)

## 1. Framework & Libraries
- **Customer App (`apps/customer-mobile`)**: React Native Expo modules architecture. Uses `@tanstack/react-query` + `react-native-mmkv`.
- **Merchant/Kitchen App (`apps/branch-tablet`)**: Next.js Progressive Web App (PWA). Heavily relies on WebSocket/Supabase Realtime for zero-latency pings and state transition controls.
- **Payments**: `@stripe/stripe-react-native` for PCI compliance on mobile.

## 2. Styling & UI Performance
- **Mobile Styling**: `StyleSheet` ONLY. Do **NOT** use Tailwind CSS. Rely on `react-native-reanimated` & `@shopify/flash-list`.
- **Tablet Styling**: Tailwind CSS v4, optimized for large touch targets (high-contrast kitchen environments).

## 3. Resilience
- **Offline Capabilities**: Ensure offline mutation queuing to handle spotty internet connections in kitchens or mobile roaming. Graceful degradation when Wi-Fi drops.
