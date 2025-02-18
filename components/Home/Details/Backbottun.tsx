import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { icons } from "@/constants";

const Backbottun = ({ containerStyle, iconStyle, onBack, tintColor }: any) => {
  return (
    <View className={`flex-row-reverse items-center mb-4 ${containerStyle}`}>
      <TouchableOpacity
        onPress={onBack || (() => router.back())}
        className="mr-0"
      >
        <Image
          source={icons.backArrow}
          tintColor={tintColor || "black"}
          className={`w-6 h-5 mt-2 ${iconStyle}`}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Backbottun;
