import { View, Text, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // TODO: Add your authentication logic here
      console.log('Sign in attempt:', { email, password });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate on success
      // router.replace('/home');
      
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
          <CustomInput  
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors(prev => ({ ...prev, email: '' }));
            }}
            label='Email'
            keyboardType="email-address"
            error={errors.email}
          />
          
          <CustomInput  
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors(prev => ({ ...prev, password: '' }));
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
            disabled={isSubmitting}
          />
          
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