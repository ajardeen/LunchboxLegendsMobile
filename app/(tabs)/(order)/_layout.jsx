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
      <Stack.Screen name="orderTracker" options={{
        title:"Order Details",
        headerShown:true
      }}/>
    </Stack>
  );
};

export default _layout;
