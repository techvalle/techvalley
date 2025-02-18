// File Path: src/components/CustomButton.tsx

import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

// Define the props for the CustomButton
interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  isLoading?: boolean;
  containerStyles?: string | ViewStyle;
  textStyles?: TextStyle;
  disabled?: boolean;
}

const CustomButtonProfile: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  isLoading = false,
  containerStyles,
  textStyles,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        containerStyles,
        disabled ? styles.disabledButton : undefined,
      ]}
      onPress={handlePress}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={[styles.buttonText, textStyles]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF6E4E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#a9a9a9",
  },
});

export default CustomButtonProfile;
