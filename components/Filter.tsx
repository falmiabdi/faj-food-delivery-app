import React from "react";
import { Text, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

interface Category {
  $id: string;
  name: string;
}

const Filter = ({ categories }: { categories: Category[] }) => {
  const params = useLocalSearchParams<{ category?: string }>();

  const filterData = [{ $id: "All", name: "All" }, ...categories];

  const handleCategoryPress = (category: string) => {
    if (params.category === category) {
      router.setParams({ category: "All" });
    } else {
      router.setParams({ category });
    }
  };

  return (
    <FlatList
      data={filterData}
      keyExtractor={(item) => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-4 pl-5"
      className="mt-3 mb-2"
      renderItem={({ item }) => {
        const isActive =
          params.category === item.$id ||
          (!params.category && item.$id === "All") ||
          (params.category === "All" && item.$id === "All");

        return (
          <TouchableOpacity
            onPress={() => handleCategoryPress(item.$id)}
            className={`flex-row items-center justify-center px-6 py-2.5 rounded-full border ${
              isActive
                ? "bg-[#D33B0D] border-[#D33B0D]"
                : "bg-white border-gray-100"
            }`}
          >
            <Text
              className={`text-sm ${
                isActive ? "text-white font-rubik-bold" : "text-black font-rubik mt-0.5"
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default Filter;
