import React, { useRef, useEffect } from "react";
import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Animated } from "react-native";

export default function TabsLayout() {
  // Read current route name
  const segments = useSegments();
  const current = segments[segments.length - 1];

  // Screens where bottom tab bar should be hidden
  const hideTabsOn = [
    "itemDetail",
    "dayMenuList",
    "orderTracker",
    "profileDetails",
    "referFriend",
    "help",
    "addressScreen",
    "favorites",
    "mySubscription",
    "orderHistory",
  ];

  const shouldHide = hideTabsOn.includes(current);

  // Animated value for slide effect
  const translateY = useRef(new Animated.Value(0)).current;

  Animated.spring(translateY, {
    toValue: shouldHide ? 90 : 0,
    useNativeDriver: true,
    stiffness: 160,
    damping: 18,
  }).start();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#004346",
        tabBarInactiveTintColor: "#999",
        sceneStyle: {
          paddingBottom: !shouldHide ? 35 : 0,
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingBottom: 5,
          transform: [{ translateY }], // ⭐ animation here
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 10, // Android shadow
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(order)"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(myCart)"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
