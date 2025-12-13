import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{
      headerShown:false,
      animation: "slide_from_right",
      animationDuration: 50,
      animationTypeForReplace: "push",
      gestureEnabled: true,
      lazy: false,
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profileDetails" options={{title:"My Profile",headerShown:true}} />
      <Stack.Screen name="addressScreen" options={{title:"Manage Addresses",headerShown:true}} />
      <Stack.Screen name="orderHistory" options={{title:"Order History",headerShown:true}} />
      <Stack.Screen name="favorites" options={{title:"Favorites",headerShown:true}} />
      <Stack.Screen name="mySubscription" options={{title:"My Subscription",headerShown:true}} />
      <Stack.Screen name="manageSubscription" options={{title:"Manage Subscription",headerShown:true}} />
      <Stack.Screen name="referFriend" options={{title:"",headerShown:true}} />
      <Stack.Screen name="help" options={{title:"",headerShown:true}} />
    </Stack>
  )
}

export default _layout