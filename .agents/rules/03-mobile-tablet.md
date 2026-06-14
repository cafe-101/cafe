# Mobile & Tablet Apps AI Rules (`apps/customer-mobile` & `apps/branch-tablet` - INACTIVE)

## 1. Framework & Libraries
- **React Native**: Expo modules architecture.
- **Data Fetching**: Uses `@tanstack/react-query` + `react-native-mmkv` (stale-while-revalidate).
- **Payments**: `@stripe/stripe-react-native` for PCI compliance.

## 2. Styling & UI Performance
- **Styling**: `StyleSheet` ONLY. Do **NOT** use Tailwind CSS.
- **Lists & Animations**: Heavily rely on `react-native-reanimated` & `@shopify/flash-list` for smooth performance.

## 3. Resilience
- **Offline Capabilities**: Ensure offline mutation queuing to handle spotty internet connections.
