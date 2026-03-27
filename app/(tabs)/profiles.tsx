import useAuthStore from "@/store/useAuthStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { updateUser, uploadAvatar } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";

const ProfileField = ({
  label,
  value,
  icon,
  isEditing,
  onChangeText,
}: {
  label: string;
  value: string;
  icon: string;
  isEditing: boolean;
  onChangeText?: (text: string) => void;
}) => (
  <View className="flex-row items-center bg-gray-50 rounded-2xl px-5 py-4 mb-3 border border-gray-100">
    <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3 shadow-sm">
      <Ionicons name={icon as any} size={20} color="#D33B0D" />
    </View>
    <View className="flex-1">
      <Text className="text-[10px] font-rubik-bold text-gray-400 uppercase tracking-widest">
        {label}
      </Text>
      {isEditing ? (
        <TextInput
          className="text-base font-rubik-bold text-black mt-0.5 p-0"
          value={value}
          onChangeText={onChangeText}
          placeholder={`Enter ${label}`}
        />
      ) : (
        <Text className="text-base font-rubik-bold text-black mt-0.5">
          {value || "Not set"}
        </Text>
      )}
    </View>
  </View>
);

const Profiles = () => {
  const { user, signOut, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Editable local state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address1, setAddress1] = useState(user?.address1 || "");
  const [address2, setAddress2] = useState(user?.address2 || "");

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/sign-in");
        },
      },
    ]);
  };

  const handleEditAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setLoading(true);
      try {
        const fileUrl = await uploadAvatar(result.assets[0].uri);
        const updated = await updateUser(user!.$id, { avatar: fileUrl });
        setUser(updated);
        Alert.alert("Success", "Profile photo updated!");
      } catch (error) {
        Alert.alert("Error", "Failed to upload image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Check if user exists before updating
      if (!user?.$id) throw new Error("User ID not found");

      // We attempt to update, but catch specific attribute errors
      const updated = await updateUser(user.$id, {
        name,
        phone,
        address1,
        address2,
      });
      setUser(updated);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes("Unknown attribute")) {
        Alert.alert(
          "Setup Required",
          "Please add 'phone', 'address1', and 'address2' attributes to your 'user' collection in Appwrite console to save these fields."
        );
      } else {
        Alert.alert("Error", "Failed to update profile. " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity>
        <Text className="text-xl font-rubik-bold text-black">Profile</Text>
        <View className="w-6" /></View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
        {/* Avatar Section */}
        <View className="items-center mt-6 mb-8">
          <View className="relative">
            <View className="w-32 h-32 rounded-full p-1 bg-gray-100 shadow-sm items-center justify-center overflow-hidden">
              {loading ? (
                <ActivityIndicator color="#D33B0D" />
              ) : user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-4xl font-rubik-bold text-gray-300">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleEditAvatar}
              className="absolute bottom-1 right-1 bg-[#D33B0D] w-10 h-10 rounded-full items-center justify-center border-4 border-white"
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Fields */}
        <ProfileField
          label="Full Name"
          value={name}
          icon="person"
          isEditing={isEditing}
          onChangeText={setName}
        />
        <ProfileField
          label="Email"
          value={user?.email || ""}
          icon="mail"
          isEditing={false} // Email typically not editable this way
        />
        <ProfileField
          label="Phone number"
          value={phone}
          icon="call"
          isEditing={isEditing}
          onChangeText={setPhone}
        />
        <ProfileField
          label="Address 1 - (Home)"
          value={address1}
          icon="home"
          isEditing={isEditing}
          onChangeText={setAddress1}
        />
        <ProfileField
          label="Address 2 - (Work)"
          value={address2}
          icon="business"
          isEditing={isEditing}
          onChangeText={setAddress2}
        />

        {/* Actions */}
        <View className="mt-8 mb-4">
          {isEditing ? (
            <TouchableOpacity
              onPress={handleSaveProfile}
              className="bg-[#D33B0D] rounded-full py-4 items-center mb-3 shadow-md"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-rubik-bold text-base">
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="bg-white border border-[#D33B0D] rounded-full py-4 items-center mb-3"
            >
              <Text className="text-[#D33B0D] font-rubik-bold text-base">
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-50 rounded-full py-4 items-center shadow-sm"
          >
            <Text className="text-red-500 font-rubik-bold text-base flex-row items-center">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profiles;