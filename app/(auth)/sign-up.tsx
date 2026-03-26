import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import useAuthStore from "@/store/useAuthStore";
import * as sentry from "@sentry/react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const handleSubmit = async () => {
    // Validate fields
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await createUser(formData);
      console.log("User created:", user);

      // Update the auth store with the user data
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      }

      // Navigate to home
      router.replace("/");
    } catch (error: any) {
      console.error("Sign up error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to create account. Please try again.",
      );
      sentry.captureException(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">
            Create Account
          </Text>
          <Text className="text-gray-600 mt-2">Sign up to get started</Text>
        </View>

        <View className="space-y-4">
          <CustomInput
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              setErrors({ ...errors, name: "" });
            }}
            label="Name"
            error={errors.name}
          />

          <CustomInput
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              setErrors({ ...errors, email: "" });
            }}
            label="Email"
            keyboardType="email-address"
            error={errors.email}
          />

          <CustomInput
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              setErrors({ ...errors, password: "" });
            }}
            label="Password"
            secureTextEntry={true}
            error={errors.password}
          />

          <CustomButton
            title={isSubmitting ? "Creating Account..." : "Sign Up"}
            onPress={handleSubmit}
            isLoading={isSubmitting}
          />

          {isSubmitting && <ActivityIndicator size="large" color="#0000ff" />}

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Already have an account? </Text>
            <Text
              className="font-bold text-blue-600"
              onPress={() => router.push("./sign-in")}
            >
              Sign In
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
