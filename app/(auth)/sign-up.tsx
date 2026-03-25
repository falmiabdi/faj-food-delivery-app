import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", name: "" });

  const handleSubmit = async () => {
    // Validation
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 4) {
      Alert.alert("Error", "Password must be at least 4 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create user in Appwrite and store in database
      const newUser = await createUser({ email, password, name });

      console.log("User created successfully:", newUser);

      // Show success message
      Alert.alert("Success!", "Account created successfully! Please sign in.", [
        {
          text: "Sign In",
          onPress: () => router.replace("./sign-in"),
        },
      ]);
    } catch (error: any) {
      console.error("Sign up error:", error);

      if (error?.message?.includes("user already exists")) {
        Alert.alert("Error", "User with this email already exists");
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
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
          <Text className="text-gray-600 mt-2">Sign up to continue</Text>
        </View>

        <View className="space-y-4">
          <CustomInput
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: "" });
            }}
            label="Name"
            error={errors.name}
          />

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
