import { Tabs } from "expo-router";
import { View, Text, Image, ImageSourcePropType } from "react-native";
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";

const TabIcon = ({ source, color, focused, badgeCount = 0 }: { source: ImageSourcePropType, color: string, focused: boolean, badgeCount?: number }) => {
  return (
    <View className="relative">
      <Image 
        source={source} 
        resizeMode="contain" 
        style={{ width: 24, height: 24, tintColor: color }} 
      />
      {badgeCount > 0 && (
        <View className="absolute -top-1.5 -right-2 bg-[#D33B0D] w-4 h-4 rounded-full items-center justify-center border border-white">
          <Text className="text-[9px] text-white font-rubik-bold">{badgeCount}</Text>
        </View>
      )}
    </View>
  );
};

export default function TabsLayout() {
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: "#D33B0D", // Consolidated theme color
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: true,
        tabBarStyle: {
           borderTopColor: '#F3F4F6',
           height: 60,
           paddingBottom: 8,
           paddingTop: 8,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={images.home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={images.search} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={images.bag} color={color} focused={focused} badgeCount={cartCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={images.person} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
