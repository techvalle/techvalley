import { icons } from "@/constants";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from "react-native";

interface CustomButtonProps {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  containerStyles?: string; // Tailwind style classes for container
  textStyles?: string; // Tailwind style classes for text
  isLoading?: boolean;
  cancel?: boolean;
  isDisable?: boolean;
  loguot?: boolean; // Optional flag for logout styling
}

const CustomButtonV2: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
  cancel = false,
  isDisable = true,
  loguot = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-primary rounded-full  w-32 h-11 flex flex-row justify-center items-center ${
        isLoading ? "opacity-50" : ""
      } ${isDisable === false ? "opacity-70" : ""} ${containerStyles}`}
      disabled={isLoading || isDisable === false}
    >
      {!isLoading && (
        <>
          {loguot ? (
            <View className="flex-row justify-center items-center">
              <Text
                className={`font-sans-arabic-medium text-base text-secondary ${textStyles}`}
              >
                {title}
              </Text>
              <Image
                source={icons.loguut}
                className="w-4 h-4 ml-2"
                resizeMode="contain"
              />
            </View>
          ) : (
            <Text
              className={`font-sans-arabic-medium text-base text-secondary ${textStyles}`}
            >
              {title}
            </Text>
          )}
        </>
      )}

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color={cancel ? "#000" : "#fff"}
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButtonV2;
