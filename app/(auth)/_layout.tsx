import { images } from "@/constants";
import { Slot } from "expo-router";
import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

const _layout = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="bg-white h-full"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Image Section */}
          <View
            className="w-full relative"
            style={{ height: Dimensions.get("screen").height / 2.25 }}
          >
            <ImageBackground
              source={images.loginGraphic}
              className="size-full rounded-b-lg"
              resizeMode="stretch"
              imageStyle={{ resizeMode: "stretch" }}
            >
              <Image
                source={images.logo}
                className="self-center size-48 absolute -bottom-16 z-10"
                resizeMode="contain"       
              />
            </ImageBackground>
          </View>
          
          {/* Form Section */}
          <View className="mt-20 px-4">
            <CustomInput  
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              label='Email'
              keyboardType="email-address"
            />
            
            <CustomInput  
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              label='Password'
              secureTextEntry={true}
            />
            
            <CustomButton 
              title="Login"
              onPress={() => {
                // Handle login logic here
                console.log('Login pressed', { email, password });
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default _layout;