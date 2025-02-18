import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants";

interface NavTopProps {
  title: string;
  containerS?: string; // Optional container style class
  logo?: boolean; // Whether to show the logo
}

const NavTop: React.FC<NavTopProps> = ({ title, containerS, logo = false }) => {
  const handleBackPress = () => {
    router.back(); // Navigate back to the previous screen
  };

  return (
    <View>
      {/* Top Section */}
      <View
        style={{
          width: "100%",
          alignItems: "flex-end",
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        {logo ? (
          <Image
            source={icons.logo}
            className={`w-9 h-9 ${containerS}`}
            resizeMode="contain"
          />
        ) : (
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              source={icons.backArrow}
              className="w-6 h-5 mt-2"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Title Section */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
          paddingTop: 2,
          paddingBottom: 5,
        }}
      >
        <Text className="font-sans-arabic-medium text-primary text-[22px] mb-4">
          {title}
        </Text>
      </View>
    </View>
  );
};

export default NavTop;
