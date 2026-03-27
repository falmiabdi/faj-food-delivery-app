import { images } from "@/constants";
import useAuthStore from "@/store/useAuthStore";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CartButtonProps {
  count?: number;
}

const CartButton: React.FC<CartButtonProps> = ({ count = 0 }) => {
  return (
    <TouchableOpacity
      onPress={() => router.push("/(tabs)/cart")}
      className="relative w-11 h-11 bg-[#D33B0D] rounded-full items-center justify-center"
    >
      <Image
        source={images.bag}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor="#ffffff"
      />
      {count > 0 && (
        <View className="absolute -top-1 -right-1 bg-white border border-[#D33B0D] w-5 h-5 rounded-full items-center justify-center">
          <Text className="text-[10px] text-[#D33B0D] font-rubik-bold">
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

/** Reusable header row: title on left, black profile circle on right */
export const HeaderRow = ({
  leftLabel,
  leftSubLabel,
}: {
  leftLabel?: string;
  leftSubLabel?: string;
  cartCount?: number;
}) => {
  const { user } = useAuthStore();

  return (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
      {/* Left: title labels */}
      <View>
        <Text className="text-xs font-rubik text-[#D33B0D] uppercase font-bold tracking-widest">
          {leftLabel || "SEARCH"}
        </Text>
        <Text className="text-2xl font-rubik-bold text-black mt-0.5">
          {leftSubLabel || "Find your food"}
        </Text>
      </View>

      {/* Right: profile circle */}
      <TouchableOpacity onPress={() => router.push("/(tabs)/profiles")}>
        {user?.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            className="w-11 h-11 rounded-full border-2 border-gray-100"
            resizeMode="cover"
          />
        ) : (
          <View className="w-11 h-11 rounded-full bg-black items-center justify-center">
            <Text className="text-white text-base font-rubik-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CartButton;