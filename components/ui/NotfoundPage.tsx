import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "@/constants";
import SafeAreaScrollView from "./SafeAreaScrollView";

const NotfoundPage = ({ text }: { text: string }) => {
  return (
    <SafeAreaScrollView className=" flex justify-center items-center ">
      <View className=" justify-center items-center ">
        <Image
          source={icons.notFound}
          resizeMode="contain"
          className="w-60 h-60 my-7"
        />
        <Text className="text-textDark text-xl">{text}</Text>
      </View>
    </SafeAreaScrollView>
  );
};

export default NotfoundPage;
