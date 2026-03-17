import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { router } from "expo-router";
import React, { useState } from "react";
import { 
  ActivityIndicator, 
  Alert, 
  Text, 
  View, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", name: "", password: "" });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", name: "", password: "" };

    // Name validation
    if (!name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      Alert.alert("Success", "User signed up successfully!");
      console.log("Sign up attempt:", { email, name, password });

      // Navigate on success
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 py-8">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
              <Text className="text-gray-600 mt-2">Sign up to continue</Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <CustomInput
                placeholder="Enter your name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
                label="Name"
                error={errors.name}
              />

              <CustomInput
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: "" }));
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
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                label="Password"
                secureTextEntry={true}
                error={errors.password}
              />

              {/* Sign Up Button */}
              <View className="mt-4">
                <CustomButton
                  title={isSubmitting ? "Signing up..." : "Sign Up"}
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                />
              </View>

              {isSubmitting && (
                <ActivityIndicator size="large" className="text-primary" />
              )}

              {/* Sign In Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Already have an account? </Text>
                <Text
                  className="font-bold text-primary ml-1"
                  onPress={() => router.push("./sign-in")}
                >
                  Sign In
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;