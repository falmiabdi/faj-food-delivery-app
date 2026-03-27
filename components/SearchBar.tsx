import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query || "");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitSearch = (text: string) => {
    router.setParams({ query: text });
  };

  const handleChangeText = (text: string) => {
    setQuery(text);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      commitSearch(text);
    }, 500);
  };

  const handleSearchPress = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    commitSearch(query);
  };

  return (
    <View className="flex-row items-center bg-gray-50 rounded-full mx-5 border border-gray-200 h-10 px-3">
      <TextInput
        className="flex-1 font-rubik text-sm text-black"
        placeholder="Search for pizzas, burgers..."
        value={query}
        onChangeText={handleChangeText}
        placeholderTextColor="#A0A0A0"
        returnKeyType="search"
        onSubmitEditing={handleSearchPress}
      />
      <TouchableOpacity onPress={handleSearchPress} className="ml-2">
        <Image
          source={images.search}

          resizeMode="contain"
          tintColor="black"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;