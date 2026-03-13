import { offers } from "@/constants";
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native"; // Added Image import
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="bg-[#ffffff] flex-1">
      <FlatList 
        data={offers}
        renderItem={({ item, index }) => (
          const if itemlength %2==0
          <View className="p-2">
            <Pressable 
              className="offer-card" 
              style={{ backgroundColor: item.color }}
            >
              {({ pressed }) => (
                <Fragment>
                  <View className="h-full w-1/2">
                    <Image  
                      source={item.image} 
                      className="size-full" 
                      resizeMode="contain"
                    />
                  </View>
                  <View className="offer_card ">
                    <Text>
                      {item.title}
                      
                    </Text>
                  </View>
                </Fragment>
              )}
            </Pressable>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}