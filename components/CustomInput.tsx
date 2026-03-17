import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import {CustomInputProps } from '@/type';


const CustomInput = ({
  placeholder = 'Enter text',
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = 'default'
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className='w-full px-4 mb-4'>
      <Text className='text-gray-700 mb-1 font-medium'>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#888"
        className={`border ${isFocused ? 'border-blue-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900 w-full`}
      />
    </View>
  )
}

export default CustomInput;