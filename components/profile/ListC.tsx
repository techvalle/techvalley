import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { icons } from "../../constants";
import { router } from "expo-router";

// Define the translations for ar, en, and fr
const translations = {
  en: {
    navigate: "Navigate",
  },
  ar: {
    navigate: "انتقل",
  },
  fr: {
    navigate: "Naviguer",
  },
};

// Props interface for TypeScript
interface ListCProps {
  title: string;
  icon: any;
  to: string;
  language: "en" | "ar" | "fr"; // Language prop
}

const ListC: React.FC<ListCProps> = ({ title, icon, to, language }) => {
  const handlePress = () => {
    router.push(`/${to}` as any); // Navigate to the specified route
  };

  return (
    <View className="border-[#D2D2D2] border-b-[1px] mb-4">
      <TouchableOpacity
        onPress={handlePress}
        className="flex w-full py-1 justify-between items-center flex-row-reverse"
      >
        <View className="flex-row-reverse items-center justify-center">
          <Image source={icon} className="w-4 h-4 ml-2" resizeMode="contain" />
          <Text className="text-primary font-sans-arabic-regular">
            {title || translations[language]?.navigate}
          </Text>
        </View>
        <Image
          source={icons.leftArrow}
          className="w-4 h-4"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default ListC;
