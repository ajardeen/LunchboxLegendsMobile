import { Stack } from "expo-router";

const _layout = () => {
  return (
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
      <Stack.Screen name="index" />
      <Stack.Screen
        name="itemDetail"
        options={{
          tabBarStyle: { display: "none" }, // hide tabs
        }}
      />
      <Stack.Screen
        name="dayMenuList"
        options={{
          tabBarStyle: { display: "none" }, // hide tabs
          headerShown: true,
          title: "Back",
        }}
      />
      <Stack.Screen
        name="createSubscription"
        options={{
          tabBarStyle: { display: "none" },
        }}
      />
    </Stack>
  );
};

export default _layout;
