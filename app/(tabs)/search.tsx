import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import { HeaderRow } from "@/components/cartButton";
import { getCategories, getMenu } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const params = useLocalSearchParams<{ query?: string; category?: string }>();
  const { addItem } = useCartStore();

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

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.$id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      customizations: [],
    });
  };

  const renderHeader = () => (
    <View className="pt-2">
      <HeaderRow leftLabel="SEARCH" leftSubLabel="Find your Favorite food" />

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
            <View className="items-center mt-20 px-10">
               <View className="w-40 h-40 bg-gray-50 rounded-full items-center justify-center mb-4">
                  <Text className="text-6xl">🔍</Text>
               </View>
              <Text className="text-xl font-rubik-bold text-black text-center">
                Nothing matched your search
              </Text>
              <Text className="text-sm font-rubik text-gray-400 text-center mt-2">
                Try a different search term or check for typos.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => router.push(`/menu-detail?id=${item.$id}`)}
            className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-3 mb-4 items-start"
          >
            <View className="w-full h-32 items-center justify-center mb-1">
              <Image
                source={{ uri: item.image_url }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <Text className="font-rubik-bold text-[15px] text-black mb-1 px-1" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="font-rubik text-[11px] text-gray-400 px-1">
              From ${item.price.toFixed(2)}
            </Text>
            
            <TouchableOpacity 
              onPress={() => handleAddToCart(item)}
              className="mt-3 px-4 py-1.5 border border-[#D33B0D]/20 rounded-full self-center"
            >
              <Text className="text-[#D33B0D] font-rubik-bold text-[11px]">
                Add to Cart +
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;