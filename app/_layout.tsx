import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8b5cf6', // Purple
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: -5 },
          shadowColor: '#8b5cf6',
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          borderRadius: 30,
          marginHorizontal: 10,
          marginBottom: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#1f2937',
        },
        headerTintColor: '#8b5cf6',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#8b5cf6' : 'transparent',
              padding: 8,
              borderRadius: 20,
            }}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={22} 
                color={focused ? 'white' : color} 
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="products"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#8b5cf6' : 'transparent',
              padding: 8,
              borderRadius: 20,
            }}>
              <Ionicons 
                name={focused ? "gift" : "gift-outline"} 
                size={22} 
                color={focused ? 'white' : color} 
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#8b5cf6' : 'transparent',
              padding: 8,
              borderRadius: 20,
            }}>
              <Ionicons 
                name={focused ? "happy" : "happy-outline"} 
                size={22} 
                color={focused ? 'white' : color} 
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#8b5cf6' : 'transparent',
              padding: 8,
              borderRadius: 20,
            }}>
              <Ionicons 
                name={focused ? "options" : "options-outline"} 
                size={22} 
                color={focused ? 'white' : color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}