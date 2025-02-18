import { icons } from "@/constants";
import { translationDelModal } from "@/constants/lang";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";

type Language = "en" | "ar" | "fr";

type DeleteModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>; // Async delete action
  language: Language; // Language selection
};

const Delt: React.FC<DeleteModalProps> = ({
  isVisible,
  onClose,
  onDelete,
  language,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Define text based on language

  const currentText = translationDelModal[language];

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(); // Trigger delete action
    } finally {
      setIsLoading(false);
      onClose(); // Close modal after delete
    }
  };

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
          source={icons.bin}
          style={{
            width: 40,
            height: 40,
            tintColor: "#FF5C39",
            resizeMode: "contain",
            marginBottom: 10,
          }}
        />

        {/* Title */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#FF5C39",
            textAlign: "center",
          }}
        >
          {currentText.title}
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 14,
            color: "gray",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {currentText.subtitle}
        </Text>

        {/* Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* Cancel Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#E0E0E0",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              marginRight: 10,
            }}
            disabled={isLoading} // Disable button while loading
          >
            <Text style={{ color: "#333", fontWeight: "bold" }}>
              {currentText.cancel}
            </Text>
          </TouchableOpacity>

          {/* Confirm/Delete Button */}
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              backgroundColor: isLoading ? "#FFA07A" : "#FF5C39",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {currentText.confirm}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Delt;
