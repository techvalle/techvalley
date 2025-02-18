import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import icons from "../../constants/icons";
import { translationBuyModal } from "@/constants/lang";

// Define a type for the props to make the modal reusable
type SuccessModalProps = {
  isVisible: boolean;
  onClose: () => void;
  language: "ar" | "en" | "fr"; // Support for multiple languages
};

// Translations for the modal content

const BuyModal = ({ isVisible, onClose, language }: SuccessModalProps) => {
  const { title, subtitle, buttonTitle } = translationBuyModal[language];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        {/* Image */}
        <Image
          source={icons.Illustration}
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
            marginBottom: 10,
          }}
        />

        {/* Title */}
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 5,
            color: "#FF5C39",
            textAlign: "center",
          }}
        >
          {title}
        </Text>

        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            marginBottom: 10,
            backgroundColor: "#FF5C39",
            paddingVertical: 10,
            paddingHorizontal: 30,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {buttonTitle}
          </Text>
        </TouchableOpacity>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 14,
            color: "gray",
            textAlign: "center",
          }}
        >
          {subtitle}
        </Text>
      </View>
    </Modal>
  );
};

export default BuyModal;
