import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants";

interface FormFieldProps {
  title: "Name" | "Email" | "Phone" | "Password";
  value: string;
  placeholder: string;
  handleChangeText: (value: string) => void;
  otherStyles?: string;
  inputStyle?: string;
  length?: number;
  error?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles = "",
  inputStyle = "",
  length,
  error = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const iconMap: Record<FormFieldProps["title"], any> = {
    Name: icons.profile,
    Email: icons.profile,
    Phone: icons.phone,
    Password: icons.lock,
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <View className={`space-y-2 ${otherStyles} my-2`}>
      <View
        className={`w-11/12 h-12 px-5 bg-white rounded-full mx-3 flex flex-row items-center shadow-sm 
          ${error ? "border border-red-500" : "border border-gray-200"}
          ${isFocused ? "border-primary shadow-md" : ""}`}
      >
        <TextInput
          className={`flex-1 text-gray-800 text-[16px] font-medium ${
            !isFocused ? "text-right" : ""
          } ${inputStyle}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={`${isFocused ? "#aaa" : "#7B7B8B"}`}
          onChangeText={handleChangeText}
          maxLength={length}
          secureTextEntry={title === "Password" && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Display Icon for Non-Focused State */}
        {!isFocused && iconMap[title] && (
          <Image
            source={iconMap[title]}
            className="w-5 h-5 ml-2"
            resizeMode="contain"
            accessibilityLabel={`${title} icon`}
          />
        )}

        {/* Password Visibility Toggle */}
        {title === "Password" && isFocused && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            accessibilityLabel="Toggle password visibility"
          >
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="w-6 h-6 ml-2"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {/* Optional Error Text */}
    </View>
  );
};

export default FormField;
