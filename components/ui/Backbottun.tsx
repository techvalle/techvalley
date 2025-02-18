import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants";

interface BackButtonProps {
  containerStyle?: string | StyleProp<ViewStyle>;
  iconStyle?: string | StyleProp<ImageStyle>;
  onBack?: () => void;
  tintColor?: string;
}

const Backbottun: React.FC<BackButtonProps> = ({
  containerStyle,
  iconStyle,
  onBack,
  tintColor = "black", // Default tintColor is black
}) => {
  return (
    <View className={`flex-row-reverse items-center mb-4 ${containerStyle}`}>
      <TouchableOpacity
        onPress={onBack || (() => router.back())}
        className="mr-0"
      >
        <Image
          source={icons.backArrow}
          tintColor={tintColor}
          className={`w-6 h-5 mt-2 ${iconStyle}`}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Backbottun;
