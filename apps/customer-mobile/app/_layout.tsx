import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { tokenCache } from "../utils/tokenCache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "YOUR_CLERK_PUBLISHABLE_KEY";

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/sign-in" />
          <Stack.Screen name="(auth)/sign-up" />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
