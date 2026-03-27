import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import { HeaderRow } from "@/components/cartButton";
import { getCategories, getMenu } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const params = useLocalSearchParams<{ query?: string; category?: string }>();

  const { data: categories } = useAppwrite({
    fn: getCategories,
  });

  const {
    data: menu,
    loading,
    refetch,
  } = useAppwrite({
    fn: getMenu,
    params: {
      query: params.query || "",
      category: params.category === "All" ? "" : params.category || "",
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      query: params.query || "",
      category: params.category === "All" ? "" : params.category || "",
    });
  }, [params.query, params.category]);

  const renderHeader = () => (
    <View className="pt-2">
      <HeaderRow leftLabel="SEARCH" leftSubLabel="Find your Favorite food" cartCount={0} />

      <View className="mt-2">
        <SearchBar />
      </View>

      {categories && <Filter categories={categories as any[]} />}
    </View>
  );

  return (
    <SafeAreaView className="bg-white flex-1 relative">
      <FlatList
        data={menu}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="justify-between px-5 gap-x-4"
        contentContainerClassName="pb-6"
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator className="mt-20" size="large" color="#D33B0D" />
          ) : (
            <View className="items-center mt-20">
              <Text className="text-lg font-rubik text-gray-500">
                No food matches your search.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-4 items-start">
            <Image
              source={{ uri: item.image_url }}
              className="w-full h-32 rounded-xl mb-3"
              resizeMode="contain"
            />
            <Text className="font-rubik-bold text-[15px] text-black mb-1" numberOfLines={2}>
              {item.name}
            </Text>
            <View className="flex-row items-center justify-between w-full mt-2">
              <Text className="font-rubik text-base text-[#D33B0D] font-bold">
                ${item.price.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity className="mt-3 py-2 px-4 border border-[#D33B0D] rounded-full self-start">
              <Text className="text-[#D33B0D] font-rubik text-xs font-semibold">
                Add to Cart +
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;