import CustomButton from "@/components/ui/CustomButton";
import { translationMessageInput } from "@/constants/lang";
import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface MessageInputProps {
  messageBody: string;
  setMessageBody: (value: string) => void;
  onSubmit: (message: string) => void;
  isLoading: boolean;
  language: "ar" | "en" | "fr";
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageBody,
  setMessageBody,
  onSubmit,
  isLoading,
  language,
}) => {
  const handleSend = () => {
    if (onSubmit) {
      onSubmit(messageBody); // Call parent’s submit handler
      setMessageBody(""); // Clear input
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={translationMessageInput[language].placeholder}
        maxLength={250}
        value={messageBody}
        onChangeText={setMessageBody}
      />
      <CustomButton
        containerStyles="w-20 rounded-lg"
        title={translationMessageInput[language].send}
        handlePress={handleSend}
        isLoading={isLoading}
      />
    </View>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 8,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
});
