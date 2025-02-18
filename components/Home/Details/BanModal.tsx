import { translationBandModal } from "@/constants/lang";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

interface BanModalProps {
  isBanned: boolean;
  reason?: string;
  onRedirect: () => void;
  language: "ar" | "en" | "fr";
}

const BanModal: React.FC<BanModalProps> = ({
  isBanned,
  reason,
  onRedirect,
  language,
}) => {
  if (!isBanned) return null;

  const t = translationBandModal[language];

  return (
    <Modal isVisible={isBanned} backdropOpacity={0.8}>
      <View style={styles.container}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.message}>{t.message}</Text>
        {reason && (
          <Text style={styles.reason}>{`${t.reason}: ${reason}`}</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={onRedirect}>
          <Text style={styles.buttonText}>{t.button}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  reason: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default BanModal;
