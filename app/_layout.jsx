import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Contexts
import { CartProvider } from "../context/CartContext";
import { BundleProvider } from "../context/BundleContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CustomerProvider } from "../context/CustomerContext";

const queryClient = new QueryClient();

// 1. Create a separate component for the logic
function RootLayoutNav() {
  const { userToken, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // console.log("segment",segments);
    
    // 1. Wait until AsyncStorage is finished
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!userToken && !inAuthGroup) {
      // 2. No token? Force them to Welcome
      router.replace("/");
    } else if (userToken && (inAuthGroup || segments.length === 0)) {
      // 3. Token found? Force them to Home
      router.replace("/(tabs)/(home)");
    }
  }, [userToken, loading, segments]);

  // 4. CRITICAL: Do not render the Stack until loading is false.
  // This prevents the app from guessing a route before the redirect logic runs.
  if (loading) {
    return null; // Or <SplashScreen />, or a <ActivityIndicator />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="(auth)/index" /> */}
      <Stack.Screen name="(auth)/Welcome2Screen" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
// 2. The main export only wraps everything in Providers
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerProvider>
        <AuthProvider>
          <BundleProvider>
            <CartProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaProvider>
                  <StatusBar style="dark" backgroundColor="#fff" />
                  
                  {/* We call the navigation component here so it can access useAuth */}
                  <RootLayoutNav />
                  
                </SafeAreaProvider>
              </GestureHandlerRootView>
            </CartProvider>
          </BundleProvider>
        </AuthProvider>
      </CustomerProvider>
    </QueryClientProvider>
  );
}