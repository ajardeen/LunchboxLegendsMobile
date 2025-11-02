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
    }}/>
  )
}

export default _layout