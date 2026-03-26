import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/appwrite";
import useAuthStore from "@/store/useAuthStore";
import * as sentry from "@sentry/react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn({ email, password });
      console.log("Signed in:", result);

      // Update the auth store with the user data
      if (result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      }

      // Navigate to home
      router.replace("/");
    } catch (error: any) {
      console.error("Sign in error:", error);
      Alert.alert("Error", "Invalid email or password. Please try again.");
      sentry.captureException(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">Welcome Back</Text>
          <Text className="text-gray-600 mt-2">Sign in to continue</Text>
        </View>

        <View className="space-y-4">
          <CustomInput
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: "" });
            }}
            label="Email"
            keyboardType="email-address"
            error={errors.email}
          />

          <CustomInput
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: "" });
            }}
            label="Password"
            secureTextEntry={true}
            error={errors.password}
          />

          <CustomButton
            title={isSubmitting ? "Signing in..." : "Sign In"}
            onPress={handleSubmit}
            isLoading={isSubmitting}
          />

          {isSubmitting && <ActivityIndicator size="large" color="#0000ff" />}

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Text
              className="font-bold text-blue-600"
              onPress={() => router.push("./sign-up")}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
