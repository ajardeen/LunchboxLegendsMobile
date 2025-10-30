import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* Handles status bar spacing automatically */}
      <SafeAreaView style={styles.safeArea}>
        {/* Optional status bar styling */}
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
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
