import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface GenderSelectionProps {
  onGenderChange: (gender: "male" | "female") => void;
  selectedGender: "male" | "female" | any;
  lang?: "ar" | "en" | "fr"; // Language: Arabic, English, French
}

interface CustomButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

const GenderSelection: React.FC<GenderSelectionProps> = ({
  onGenderChange,
  selectedGender,
  lang = "ar", // Default to Arabic
}) => {
  // Custom button component
  const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    selected,
    onPress,
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        className={`px-3 py-2 rounded-full mx-2 w-28 text-center ${
          selected ? "bg-primary" : "bg-textLight"
        }`}
      >
        <Text
          className={`text-center ${selected ? "text-white" : "text-white"}`}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  // Gender labels based on language
  const genderLabels = {
    male: lang === "ar" ? "ذكر" : lang === "fr" ? "Homme" : "Male",
    female: lang === "ar" ? "أنثى" : lang === "fr" ? "Femme" : "Female",
  };

  return (
    <View className="flex flex-row justify-center space-x-4 mt-4 mb-4">
      {/* Male Button */}
      <CustomButton
        title={genderLabels.male}
        selected={selectedGender === "male"}
        onPress={() => onGenderChange("male")}
      />

      {/* Female Button */}
      <CustomButton
        title={genderLabels.female}
        selected={selectedGender === "female"}
        onPress={() => onGenderChange("female")}
      />
    </View>
  );
};

export default GenderSelection;
