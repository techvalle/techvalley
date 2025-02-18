import { icons } from "@/constants";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  isDisable?: boolean;
  con?: boolean;
  cancel?: boolean;
  classNamee?: string;
  loguot?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
  isDisable = false,
  classNamee = "",
  con = false,
  cancel = false,
  loguot = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading || isDisable}
      style={{ backgroundColor: con ? "#E4E4E4" : "#FF6E4E" }}
      className={`bg-primary rounded-full min-h-[40px] w-64 flex-row justify-center items-center
        
        ${isLoading || isDisable ? "opacity-50" : ""}
       ${containerStyles}  ${classNamee}`}
    >
      {isLoading ? (
        <ActivityIndicator
          animating={true}
          color={cancel ? "#000" : "#fff"}
          size="small"
        />
      ) : (
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
    </TouchableOpacity>
  );
};

export default CustomButton;
