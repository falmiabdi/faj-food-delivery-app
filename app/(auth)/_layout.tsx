import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Slot } from 'expo-router'  // Fixed import

const _layout = () => {
  return (
    <SafeAreaView>
      <Text>Auth layout thsi si like this </Text>
      <Slot/>
    </SafeAreaView>
  )
}

export default _layout