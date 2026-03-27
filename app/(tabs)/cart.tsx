import { createOrder } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import useAuthStore from "@/store/useAuthStore";
import { CartItem } from "@/type.d";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DELIVERY_FEE = 0;
const DISCOUNT = 0;

const CartItemRow = ({ item }: { item: CartItem }) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();
  const customizations = item.customizations ?? [];

  const customTotal =
    customizations.reduce((s, c) => s + c.price, 0) * item.quantity;
  const rowTotal = (item.price * item.quantity + customTotal).toFixed(2);

  return (
    <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-3 border border-gray-100 shadow-sm">
      <Image
        source={{ uri: item.image_url }}
        className="w-16 h-16 rounded-xl mr-3"
        resizeMode="contain"
      />
      <View className="flex-1">
        <Text className="font-rubik-bold text-sm text-black" numberOfLines={1}>
          {item.name}
        </Text>
        {customizations.length > 0 && (
          <Text className="font-rubik text-xs text-gray-400 mt-0.5" numberOfLines={1}>
            {customizations.map((c) => c.name).join(", ")}
          </Text>
        )}
        <Text className="font-rubik-bold text-[#D33B0D] text-sm mt-1">
          ${rowTotal}
        </Text>
      </View>

      {/* Qty controls */}
      <View className="flex-row items-center gap-x-3 ml-2">
        <TouchableOpacity
          onPress={() => decreaseQty(item.id, customizations)}
          className="w-7 h-7 rounded-full border border-gray-300 items-center justify-center"
        >
          <Text className="text-base text-black font-rubik-bold leading-none">−</Text>
        </TouchableOpacity>
        <Text className="font-rubik-bold text-black text-base w-5 text-center">
          {item.quantity}
        </Text>
        <TouchableOpacity
          onPress={() => increaseQty(item.id, customizations)}
          className="w-7 h-7 rounded-full bg-[#D33B0D] items-center justify-center"
        >
          <Text className="text-base text-white font-rubik-bold leading-none">+</Text>
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          onPress={() => removeItem(item.id, customizations)}
          className="ml-1"
        >
          <Text className="text-red-400 text-lg">🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Cart = () => {
  const { user } = useAuthStore();
  const { items, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const [loading, setLoading] = useState(false);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const total = subtotal - DISCOUNT + DELIVERY_FEE;

  const handleOrder = async () => {
    if (!user) {
      Alert.alert("Error", "Please sign in to place an order.");
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        userId: user.$id,
        items: items,
        totalPrice: total,
        address: user.address1 || "No address provided",
      });

      Alert.alert(
        "Order Placed! 🎉",
        `Your order of ${totalItems} item(s) worth $${total.toFixed(2)} has been placed.`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.replace("/(tabs)");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes("Collection with the requested ID 'orders' could not be found")) {
        Alert.alert(
          "Setup Required",
          "The 'orders' collection doesn't exist yet. Please create a collection with ID 'orders' in your Appwrite console."
        );
      } else {
        Alert.alert("Error", "Failed to place order. " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f8f8]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-3"><Text className="text-2xl font-rubik-bold">←</Text></TouchableOpacity>
        <Text className="text-xl font-rubik-bold text-black flex-1">My Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}><Text className="text-sm font-rubik text-red-400">Clear All</Text></TouchableOpacity>
        )}
      </View>

      {/* Delivery Location Banner */}
      {items.length > 0 && (
        <View className="mx-5 mb-3 bg-[#D33B0D]/10 rounded-xl px-4 py-2 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xs font-rubik text-[#D33B0D] uppercase font-bold">DELIVERY LOCATION</Text>
            <Text className="font-rubik-bold text-black text-sm mt-0.5" numberOfLines={1}>{user?.address1 || "Address not set"}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push("/(tabs)/profiles")}
            className="bg-[#D33B0D] rounded-full px-3 py-1 ml-3"
          ><Text className="text-white text-xs font-rubik-bold">{user?.address1 ? "Change" : "Set Address"}</Text></TouchableOpacity>
        </View>
      )}

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">🛒</Text>
          <Text className="font-rubik-bold text-lg text-black">Your cart is empty</Text>
          <Text className="font-rubik text-sm text-gray-400 mt-1">Add some delicious food!</Text>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/search")}
            className="mt-6 bg-[#D33B0D] px-8 py-3 rounded-full"
          ><Text className="text-white font-rubik-bold">Browse Menu</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) =>
            item.id + (item.customizations?.map((c) => c.id).join("-") ?? "")
          }
          renderItem={({ item }) => <CartItemRow item={item} />}
          contentContainerClassName="px-5 pt-2 pb-4"
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View className="mt-2 bg-white rounded-2xl px-5 py-4 border border-gray-100">
              <Text className="font-rubik-bold text-base text-black mb-4">
                Payment Summary
              </Text>
              <View className="gap-y-3">
                <View className="flex-row justify-between">
                  <Text className="font-rubik text-gray-500">
                    Total Items ({totalItems})
                  </Text>
                  <Text className="font-rubik-bold text-black">
                    ${subtotal.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="font-rubik text-gray-500">Delivery Fee</Text>
                  <Text className="font-rubik-bold text-green-500">Free</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="font-rubik text-gray-500">Discount</Text>
                  <Text className="font-rubik-bold text-red-400">
                    -${DISCOUNT.toFixed(2)}
                  </Text>
                </View>
                <View className="h-px bg-gray-100 my-1" />
                <View className="flex-row justify-between">
                  <Text className="font-rubik-bold text-black text-base">
                    Total
                  </Text>
                  <Text className="font-rubik-bold text-[#D33B0D] text-base">
                    ${total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          }
        />
      )}

      {/* Order Now button */}
      {items.length > 0 && (
        <View className="px-5 pb-6 pt-3">
          <TouchableOpacity
            onPress={handleOrder}
            className="bg-[#D33B0D] rounded-full py-4 items-center"
          >
            <Text className="text-white font-rubik-bold text-base">
              Order Now · ${total.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;