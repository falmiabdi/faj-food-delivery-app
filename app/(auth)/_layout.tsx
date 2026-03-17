import { images } from "@/constants";
import { Slot } from "expo-router";
import React, { useState } from "react";

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
       <Slot/>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default _layout;