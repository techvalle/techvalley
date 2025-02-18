import React from "react";
import { View, Text, TextInput } from "react-native";

type Language = "ar" | "en" | "fr";

interface FormFieldCProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  type: "n" | "t"; // "n" for numeric, "t" for text
  placeholder: string;
  multiline?: boolean;
  language: Language;
}

const FormFieldC: React.FC<FormFieldCProps> = ({
  label,
  value,
  onChangeText,
  type,
  placeholder,
  multiline = false,
  language,
}) => {
  const maxLength = type === "n" ? 10 : 200; // Set maxLength dynamically

  return (
    <View className="mb-4 mx-1 p-1 overflow-hidden">
      {/* Label */}
      <Text
        className={`font-sans-arabic-medium mb-2 px-1 text-base text-primary ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {label}
      </Text>
      {/* Input */}
      <TextInput
        value={value}
        maxLength={maxLength}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={type === "n" ? "numeric" : "default"}
        className={`w-full p-2 bg-white rounded border-[#eeecec] border-[1px] ${
          language === "ar" ? "text-right" : "text-left"
        } ${multiline ? "h-32" : "h-12"}`}
        multiline={multiline}
      />
    </View>
  );
};

export default FormFieldC;
