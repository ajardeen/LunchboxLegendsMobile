import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { CartProvider } from "../context/CartContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BundleProvider } from "../context/BundleContext";
import Welcome2Screen from "./(auth)/Welcome2Screen";
import Welcome1Screen from "./(auth)/Welcome1Screen";
import LoginScreen from "./(auth)/login";
import SignupScreen from "./(auth)/signup";
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <BundleProvider>
        <CartProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <SafeAreaView style={styles.safeArea}>
                <StatusBar style="dark" backgroundColor="#fff" />

                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                    animationDuration: 50,
                    animationTypeForReplace: "push",
                    gestureEnabled: true,
                    lazy: false,
                  }}
                >
                  <Stack.Screen name="(auth)/Welcome1Screen"  />
                  <Stack.Screen name="(auth)/Welcome2Screen"    />
                  <Stack.Screen name="(auth)/Login"   />
                  <Stack.Screen name="(auth)/Signup"    />
                  <Stack.Screen name="(tabs)" />
                </Stack>
              </SafeAreaView>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </CartProvider>
      </BundleProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
