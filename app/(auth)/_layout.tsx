import { images } from "@/constants";
import { Slot } from "expo-router";
import React from "react";
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

const { height } = Dimensions.get("window");

const Layout = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          {/* Header Image Section - Reduced height */}
          <View className="w-full" style={{ height: height * 0.25 }}>
            <ImageBackground
              source={images.loginGraphic}
              className="w-full h-full"
              resizeMode="cover"
            >
              {/* Empty View for background */}
            </ImageBackground>
          </View>

          {/* Logo positioned between header and content */}
          <View className="items-center -mt-12 mb-4 z-10">
            <View className="bg-white p-2 rounded-full shadow-lg">
              <Image
                source={images.logo}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Content Area */}
          <View style={{ 
            paddingHorizontal: 16,
            paddingBottom: 40,
            minHeight: height * 0.7,
          }}>
            <Slot />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Layout;