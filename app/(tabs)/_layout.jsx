import React, { useRef } from "react";
import { Tabs, useSegments, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Animated } from "react-native";

export default function TabsLayout() {
  const segments = useSegments();
  const current = segments[segments.length - 1];

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
    "paymentSuccessScreen",
  ];

  const shouldHide = hideTabsOn.includes(current);
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
          paddingBottom: 8,
          transform: [{ translateY }],
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 10,
        },
      }}
    >
      {/* HOME TAB */}
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // adjust this path based on your file structure
            // e.g. if your home index is app/(tabs)/(home)/index.tsx, this works:
            router.replace("/(home)");
          },
        }}
      />

      {/* ORDERS TAB */}
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace("/(order)");
          },
        }}
      />

      {/* CART TAB */}
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace("/(myCart)");
          },
        }}
      />

      {/* PROFILE TAB */}
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace("/(profile)");
          },
        }}
      />
    </Tabs>
  );
}
