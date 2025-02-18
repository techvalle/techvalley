import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import Modal from "react-native-modal";
import { Entypo } from "@expo/vector-icons";

type ErrorModalProps = {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  imageSource?: ImageSourcePropType; // Optional image source
  language?: "en" | "ar" | "fr"; // Multilingual support
};

const translations = {
  en: {
    close: "Close",
  },
  ar: {
    close: "إغلاق",
  },
  fr: {
    close: "Fermer",
  },
};

const ErrorModalC: React.FC<ErrorModalProps> = ({
  isVisible,
  onClose,
  message,
  imageSource,
  language = "en", // Default to English
}) => {
  const currentTranslations = translations[language];

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
      className="flex justify-center items-center"
    >
      <View
        className="bg-white rounded-lg p-6 shadow-lg w-4/5 items-center"
        style={{ alignItems: "center" }} // Ensures alignment
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-3 right-3 z-10"
        >
          <Entypo name="cross" size={24} color="#FF6E4E" />
        </TouchableOpacity>

        {/* Error Image */}
        {imageSource && (
          <Image
            source={imageSource}
            className="w-24 h-24 mb-4"
            resizeMode="contain"
          />
        )}

        {/* Error Message */}
        <Text className="text-lg text-center text-gray-800 mb-6">
          {message}
        </Text>

        {/* Close Action Button */}
        <TouchableOpacity
          onPress={onClose}
          className="bg-primary px-6 py-3 rounded"
          style={{ backgroundColor: "#FF6E4E" }}
        >
          <Text className="text-white text-sm font-bold">
            {currentTranslations.close}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ErrorModalC;
