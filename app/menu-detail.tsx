import { getMenu } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import { CartCustomization } from "@/type.d";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MenuDetail = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomizations, setSelectedCustomizations] = useState<CartCustomization[]>([]);
  const { addItem, getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    getMenu({ query: "", category: "" })
      .then((docs) => {
        const found = docs.find((d: any) => d.$id === params.id);
        setItem(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D33B0D" />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="font-rubik text-gray-500">Item not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-[#D33B0D] font-rubik-bold">← Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Separate customizations into toppings and sides
  const relatedCustomizations: any[] = item.menu_customizations ?? [];
  const toppings = relatedCustomizations.filter(
    (c: any) => c.customizations?.type === "topping"
  );
  const sides = relatedCustomizations.filter(
    (c: any) => c.customizations?.type === "side"
  );

  const toggleCustomization = (cust: any) => {
    const asCartCust: CartCustomization = {
      id: cust.customizations.$id,
      name: cust.customizations.name,
      price: cust.customizations.price,
      type: cust.customizations.type,
    };
    setSelectedCustomizations((prev) => {
      const exists = prev.find((c) => c.id === asCartCust.id);
      return exists ? prev.filter((c) => c.id !== asCartCust.id) : [...prev, asCartCust];
    });
  };

  const isSelected = (cust: any) =>
    selectedCustomizations.some((c) => c.id === cust.customizations?.$id);

  const handleAddToCart = () => {
    addItem({
      id: item.$id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      customizations: selectedCustomizations,
    });
    Alert.alert("Added!", `${item.name} added to cart.`, [
      { text: "Continue Shopping", style: "cancel" },
      { text: "View Cart", onPress: () => router.push("/(tabs)/cart") },
    ]);
  };

  const CustomizationChip = ({ cust }: { cust: any }) => {
    const selected = isSelected(cust);
    return (
      <TouchableOpacity
        onPress={() => toggleCustomization(cust)}
        className={`items-center mr-3 mb-2 px-3 py-2 rounded-xl border ${
          selected ? "border-[#D33B0D] bg-[#D33B0D]/10" : "border-gray-200 bg-gray-50"
        }`}
      >
        <Text className="text-xl mb-1">
          {cust.customizations?.type === "topping" ? "🧀" : "🍟"}
        </Text>
        <Text className={`text-xs font-rubik ${selected ? "text-[#D33B0D] font-rubik-bold" : "text-black"}`}>
          {cust.customizations?.name}
        </Text>
        <Text className="text-[10px] text-gray-400 mt-0.5">
          +${cust.customizations?.price}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top bar */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-1">
        <TouchableOpacity onPress={() => router.back()}><Text className="text-2xl">←</Text></TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          className="relative w-10 h-10 bg-[#D33B0D] rounded-full items-center justify-center"
        >
          <Text className="text-white text-base">🛒</Text>
          {cartCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-white border border-[#D33B0D] w-4 h-4 rounded-full items-center justify-center">
              <Text className="text-[9px] text-[#D33B0D] font-rubik-bold">{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View className="mx-5 mt-2 bg-gray-50 rounded-3xl overflow-hidden h-52 items-center justify-center">
          <Image
            source={{ uri: item.image_url }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        {/* Info */}
        <View className="px-5 mt-5">
          <Text className="text-2xl font-rubik-bold text-black">{item.name}</Text>
          <View className="flex-row items-center gap-x-3 mt-1">
            <Text className="text-[#D33B0D] font-rubik-bold text-xl">
              ${item.price.toFixed(2)}
            </Text>
            <View className="flex-row items-center gap-x-1">
              <Text className="text-yellow-400">⭐</Text>
              <Text className="font-rubik text-sm text-gray-500">{item.rating}</Text>
            </View>
          </View>

          {/* Badges */}
          <View className="flex-row gap-x-4 mt-4">
            <View className="items-center">
              <Text className="font-rubik text-xs text-gray-400">Calories</Text>
              <Text className="font-rubik-bold text-sm text-black">{item.calories} Cal</Text>
            </View>
            <View className="w-px bg-gray-100" />
            <View className="items-center">
              <Text className="font-rubik text-xs text-gray-400">Protein</Text>
              <Text className="font-rubik-bold text-sm text-black">{item.protein}g</Text>
            </View>
            <View className="w-px bg-gray-100" />
            <View className="items-center">
              <Text className="font-rubik text-xs text-gray-400">Delivery</Text>
              <Text className="font-rubik-bold text-sm text-green-500">Free</Text>
            </View>
            <View className="w-px bg-gray-100" />
            <View className="items-center">
              <Text className="font-rubik text-xs text-gray-400">Time</Text>
              <Text className="font-rubik-bold text-sm text-black">20-30 min</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="font-rubik text-sm text-gray-500 mt-4 leading-relaxed">
            {item.description}
          </Text>

          {/* Toppings */}
          {toppings.length > 0 && (
            <View className="mt-5">
              <Text className="font-rubik-bold text-base text-black mb-3">Toppings</Text>
              <View className="flex-row flex-wrap">
                {toppings.map((t: any) => (
                  <CustomizationChip key={t.$id} cust={t} />
                ))}
              </View>
            </View>
          )}

          {/* Sides */}
          {sides.length > 0 && (
            <View className="mt-4 mb-6">
              <Text className="font-rubik-bold text-base text-black mb-3">Side options</Text>
              <View className="flex-row flex-wrap">
                {sides.map((s: any) => (
                  <CustomizationChip key={s.$id} cust={s} />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add to Cart button */}
      <View className="px-5 pb-6 pt-3 border-t border-gray-100">
        {selectedCustomizations.length > 0 && (
          <Text className="text-center text-xs font-rubik text-gray-400 mb-2">
            +${selectedCustomizations.reduce((s, c) => s + c.price, 0).toFixed(2)} extras
          </Text>
        )}
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-[#D33B0D] rounded-full py-4 items-center"
        >
          <Text className="text-white font-rubik-bold text-base">
            Add to Cart · ${(item.price + selectedCustomizations.reduce((s, c) => s + c.price, 0)).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MenuDetail;
