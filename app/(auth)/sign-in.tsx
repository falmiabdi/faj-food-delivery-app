import { View, Text, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";

const SignIn = () => {
  // State management with formData object
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // Separate state for errors
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Basic password validation
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message and navigate
      Alert.alert('Success', 'You have successfully signed in!');
      router.replace('/');
      
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">Welcome Back</Text>
          <Text className="text-gray-600 mt-2">Sign in to continue</Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <CustomInput  
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              setErrors({ ...errors, email: '' });
            }}
            label='Email'
            keyboardType="email-address"
            error={errors.email}
          />
          
          {/* Password Input */}
          <CustomInput  
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              setErrors({ ...errors, password: '' });
            }}
            label='Password'
            secureTextEntry={true}
            error={errors.password}
          />
          
          {/* Forgot Password Link */}
          <Text 
            className="text-right text-blue-600 mt-2"
            onPress={() => router.push('./forgot-password')}
          >
            Forgot Password?
          </Text>
          
          {/* Sign In Button */}
          <CustomButton 
            title={isSubmitting ? "Signing in..." : "Sign In"}
            onPress={handleSubmit}
            isLoading={isSubmitting}
          />
          
          {/* Loading Indicator */}
          {isSubmitting && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          
          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-4">
            <Text className='text-gray-600'>
              Don't have an account?{' '}
            </Text>
            <Text 
              className='font-bold text-blue-600' 
              onPress={() => router.push('./sign-up')}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default SignIn;