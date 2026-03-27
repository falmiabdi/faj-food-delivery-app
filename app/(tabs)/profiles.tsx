import useAuthStore from "@/store/useAuthStore";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingItem {
  icon: string;
  label: string;
  action?: () => void;
  value?: string;
  danger?: boolean;
}

const Profiles = () => {
  const { user, signOut } = useAuthStore();

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

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Account",
      items: [
        { icon: "👤", label: "Full Name", value: user?.name || "—" },
        { icon: "✉️", label: "Email", value: user?.email || "—" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: "🔔", label: "Notifications", action: () => {} },
        { icon: "🌍", label: "Language", value: "English" },
        { icon: "🌙", label: "Dark Mode", action: () => {} },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "📞", label: "Contact Support", action: () => {} },
        { icon: "⭐", label: "Rate the App", action: () => {} },
        { icon: "📄", label: "Privacy Policy", action: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-5 pt-6 pb-2">
          <Text className="text-sm font-rubik text-[#D33B0D] uppercase font-bold tracking-widest">
            My
          </Text>
          <Text className="text-2xl font-rubik-bold text-black mt-1">
            Profile
          </Text>
        </View>

        {/* Avatar Card */}
        <View className="mx-5 mt-4 bg-gray-50 rounded-3xl p-6 items-center border border-gray-100">
          <View className="relative">
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-[#D33B0D] items-center justify-center">
                <Text className="text-white text-3xl font-rubik-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "?"}
                </Text>
              </View>
            )}
            {/* Online dot */}
            <View className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
          </View>
          <Text className="mt-4 text-xl font-rubik-bold text-black">
            {user?.name || "Guest"}
          </Text>
          <Text className="mt-1 text-sm font-rubik text-gray-400">
            {user?.email || "Not signed in"}
          </Text>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <View key={section.title} className="mx-5 mt-6">
            <Text className="text-xs font-rubik-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
              {section.title}
            </Text>
            <View className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={item.action}
                  activeOpacity={item.action ? 0.6 : 1}
                  className={`flex-row items-center justify-between px-5 py-4 ${
                    idx < section.items.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <View className="flex-row items-center gap-x-3">
                    <Text className="text-xl">{item.icon}</Text>
                    <Text
                      className={`font-rubik text-[15px] ${
                        item.danger ? "text-red-500" : "text-black"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {item.value ? (
                    <Text className="font-rubik text-sm text-gray-400">
                      {item.value}
                    </Text>
                  ) : (
                    <Text className="text-gray-300 text-lg">›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View className="mx-5 mt-6 mb-10">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-50 border border-red-200 rounded-2xl py-4 items-center"
          >
            <Text className="text-red-500 font-rubik-bold text-base">
              🚪  Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profiles;