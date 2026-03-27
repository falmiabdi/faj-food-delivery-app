import { Tabs } from "expo-router";
import { Image, ImageSourcePropType } from "react-native";
import { images } from "@/constants";

const TabIcon = ({ source, color, focused }: { source: ImageSourcePropType, color: string, focused: boolean }) => {
  return (
    <Image 
      source={source} 
      resizeMode="contain" 
      style={{ width: 24, height: 24, tintColor: color }} 
    />
  );
};

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: "#DF5A0C", // Theme orange color
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: true,
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
            <TabIcon source={images.bag} color={color} focused={focused} />
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
