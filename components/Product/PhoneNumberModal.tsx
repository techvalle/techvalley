import React, { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { translationProducts } from "@/constants/lang";

interface PhoneNumberModalProps {
  phoneNumber: string | null;
  isVisible: boolean;
  onClose: () => void;
  lang: "ar" | "en" | "fr"; // Language code
}

const PhoneNumberModal: React.FC<PhoneNumberModalProps> = ({
  phoneNumber,
  isVisible,
  onClose,
  lang = "en",
}) => {
  const [copied, setCopied] = useState(false);

  const t = translationProducts[lang]; // Get translations for the selected language

  // Show a toast for success or error
  const showToast = (type: "success" | "error", message: string) => {
    Toast.show({
      type,
      text1: type === "success" ? t.title : t.copyError,
      text2: message,
    });
  };

  // Function to copy phone number to clipboard
  const copyToClipboard = async () => {
    if (!phoneNumber) {
      showToast("error", t.noPhoneNumber);
      return;
    }

    try {
      await Clipboard.setStringAsync(phoneNumber);
      setCopied(true);
    } catch (error) {
      console.error("Error copying to clipboard: ", error);
      showToast("error", t.copyError);
    } finally {
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver={true}
    >
      <View className="bg-white rounded-lg p-6">
        <Text className="text-xl font-bold text-center mb-4">{t.title}</Text>
        {phoneNumber ? (
          <>
            <Text className="text-base text-gray-800 text-center mb-6">
              {phoneNumber}
            </Text>
            <TouchableOpacity
              className="bg-primary rounded py-3 px-5"
              onPress={copyToClipboard}
            >
              <Text className="text-white text-center font-semibold">
                {copied ? t.copied : t.copyButton}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text className="text-base text-red-600 text-center mb-6">
            {t.noPhoneNumber}
          </Text>
        )}
        <TouchableOpacity
          className="mt-4 bg-gray-200 rounded py-3 px-5"
          onPress={onClose}
        >
          <Text className="text-gray-800 text-center font-semibold">
            {t.closeButton}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PhoneNumberModal;
