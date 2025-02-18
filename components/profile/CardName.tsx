import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";

interface CardNameProps {
  className?: string; // Optional className for additional styles
  icon: ImageSourcePropType; // Icon source type for the image
  title: string; // Title text for the card
}

const CardName: React.FC<CardNameProps> = ({ className = "", icon, title }) => {
  return (
    <View
      className={`flex-row-reverse items-center justify-center bg-primary mb-2 py-[1px] px-[14px] rounded-full ${className}`}
    >
      <Text className="text-white font-sans-arabic-light">{title}</Text>
      <Image source={icon} className="w-4 h-4 mr-1" resizeMode="contain" />
    </View>
  );
};

export default CardName;
