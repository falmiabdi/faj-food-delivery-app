import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
}

const CustomButton = ({ title, onPress, isLoading }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className="bg-blue-600 py-3 rounded-lg"
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-bold">{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
