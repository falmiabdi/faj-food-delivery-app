import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router'  // Fixed import

const LayOut = () => {
  const isAuthenticated = true;
  if (!isAuthenticated) {
    return <Redirect href="./(auth)/sign-in"/>
  }
  return <Slot/>
}

export default LayOut