import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { CartProvider } from "../context/CartContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BundleProvider } from "../context/BundleContext";
import { AuthProvider } from "../context/AuthContext";
import { CustomerProvider } from "../context/CustomerContext";
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerProvider>
        <AuthProvider>
          <BundleProvider>
            <CartProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaProvider>
                  <StatusBar style="auto" style="dark" backgroundColor="#fff" />

                  <Stack
                    initialRouteName="Index"
                    screenOptions={{
                      headerShown: false,
                      animation: "slide_from_right",
                      animationDuration: 50,
                      animationTypeForReplace: "push",
                      gestureEnabled: true,
                      lazy: false,
                    }}
                  >
                    {/* <Stack.Screen name="(auth)/Welcome1Screen" /> */}
                    {/* <Stack.Screen name="(auth)/Welcome2Screen" /> */}

                    <Stack.Screen name="(tabs)" />
                  </Stack>
                </SafeAreaProvider>
              </GestureHandlerRootView>
            </CartProvider>
          </BundleProvider>
        </AuthProvider>
      </CustomerProvider>
    </QueryClientProvider>
  );
}


