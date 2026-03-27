import { HeaderRow } from "@/components/cartButton";
import { getMenu } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";
import { images, offers } from "@/constants";
import cn from 'clsx';
import { router } from "expo-router";
import { Fragment, useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { addItem } = useCartStore();
  const { data: menu, loading, refetch } = useAppwrite({
    fn: getMenu,
    params: { category: "", query: "" },
    skip: true
  });

  useEffect(() => {
    refetch({ category: "", query: "" });
  }, []);

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.$id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      customizations: [],
    });
  };

  const renderOffer = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;
    return (
      <View className="mb-4">
        <Pressable
          className={cn('h-40 rounded-3xl overflow-hidden flex-row items-center px-4', isEven ? 'flex-row-reverse' : 'flex-row')}
          style={{ backgroundColor: item.color }}
          android_ripple={{ color: '#ffffff22' }}
        >
          <View className="h-full w-1/2 items-center justify-center">
            <Image
              source={item.image}
              className="size-full"
              resizeMode="contain"
            />
          </View>
          <View className={cn("flex-1", isEven ? 'pl-4' : 'pr-4')}>
            <Text className="text-xl font-rubik-bold text-white leading-tight">
              {item.title}
            </Text>
            <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mt-2">
               <Image
                 source={images.arrowRight}
                 className="size-4"
                 resizeMode='contain'
                 tintColor='#ffffff'
               />
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <FlatList
        data={menu}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="justify-between px-5 gap-x-4"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="pb-4">
            <HeaderRow
              leftLabel="Deliver To"
              leftSubLabel="Koye Facce"
            />
            
            {/* Offers Slider / List */}
            <View className="px-5 mt-2">
               <Text className="text-lg font-rubik-bold text-black mb-3">Special Offers</Text>
               <FlatList 
                 data={offers}
                 renderItem={renderOffer}
                 keyExtractor={(item) => item.id.toString()}
                 scrollEnabled={false} // Since nested in FlatList header
               />
            </View>

            <View className="px-5 mt-4 flex-row justify-between items-center mb-1">
               <Text className="text-lg font-rubik-bold text-black">Recommended</Text>
               <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
                  <Text className="text-sm font-rubik text-[#D33B0D]">View All</Text>
               </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
             <ActivityIndicator className="mt-10" color="#D33B0D" size="large" />
          ) : (
             <View className="items-center mt-10">
                <Text className="text-gray-400">No items available.</Text>
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
              ${item.price.toFixed(2)}
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
        contentContainerClassName="pb-28"
      />
    </SafeAreaView>
  );
}