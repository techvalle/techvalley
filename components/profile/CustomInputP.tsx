import React from "react";
import { View, TextInput, Image, TextInputProps } from "react-native";
import { icons } from "../../constants";

interface CustomInputPProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  className?: string;
  type?: "d" | "p" | "f"; // "d" = date, "p" = profile, "f" = phone
  edit?: boolean;
  lang?: "ar" | "en" | "fr"; // Language: Arabic, English, French
}

const CustomInputP: React.FC<CustomInputPProps> = ({
  value,
  onChangeText,
  placeholder,
  className = "",
  type,
  edit = true,
  lang = "en",
  ...rest
}) => {
  // Determine text alignment and writing direction based on language
  const isRTL = lang === "ar";

  return (
    <View
      className={`border border-[#D8D6D6] rounded-full flex-row px-3 mb-4 w-full h-11 justify-center items-center ${className}`}
    >
      <TextInput
        className="text-right w-[95%] h-full"
        value={value}
        editable={edit}
        onChangeText={onChangeText}
        placeholder={placeholder}
        textAlign={isRTL ? "right" : "left"} // Adjust text alignment for Arabic
        {...rest}
      />
      {type === "d" && (
        <Image
          source={icons.dateIn}
          className="w-4 h-4 mx-1"
          resizeMode="contain"
        />
      )}
      {type === "p" && (
        <Image
          source={icons.profileIn}
          className="w-4 h-4 mx-1"
          resizeMode="contain"
        />
      )}
      {type === "f" && (
        <Image
          source={icons.phoneIn}
          className="w-4 h-4 mx-1"
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default CustomInputP;
