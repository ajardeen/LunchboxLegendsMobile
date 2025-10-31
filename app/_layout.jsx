import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { CartProvider } from "../context/CartContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
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
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="itemDetail" />
              <Stack.Screen name="myCart" />
              <Stack.Screen name="PaymentSuccessScreen" />
            </Stack>

           
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
