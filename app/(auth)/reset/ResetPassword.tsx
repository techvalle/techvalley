import React, { useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router"; // For navigation
import { ResetPasswordN } from "@/lib/api";
import FormField from "@/components/Auth/FormField";
import CustomButton from "@/components/ui/CustomButton";
import ErrorModal from "@/components/ui/ErrorModal"; // For better error handling UI
import { useUserStore } from "@/store/userStore";
import Toast from "react-native-toast-message";
import { translationReset } from "@/constants/lang";

// Translations object for multilingual support

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, updateUserData, language } = useUserStore(); // Access user, updater function, and language state

  const t = translationReset[language]; // Get translations based on selected language

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: t.successToastTitle,
      text2: t.successToastMessage,
    });
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setErrorMessage("");
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showError(t.errorEmptyFields);
      return;
    }

    if (newPassword !== confirmPassword) {
      showError(t.errorMismatch);
      return;
    }

    if (newPassword.length < 6) {
      showError(t.errorShortPassword);
      return;
    }

    setIsLoading(true);

    try {
      const oldPassword = user?.Details?.password;
      if (!oldPassword) {
        throw new Error(t.errorOldPasswordMissing);
      }

      await ResetPasswordN(newPassword, oldPassword);

      // Update the password in the Zustand store
      await updateUserData({ password: newPassword });

      showToast();

      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Password reset failed:", error.message || error);
      showError(error.message || t.errorResetFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.title}</Text>
      <FormField
        title="Password"
        placeholder={t.newPasswordPlaceholder}
        value={newPassword}
        handleChangeText={(text) => setNewPassword(text.trim())}
      />

      <FormField
        title="Password"
        placeholder={t.confirmPasswordPlaceholder}
        value={confirmPassword}
        handleChangeText={(text) => setConfirmPassword(text.trim())}
      />

      <CustomButton
        title={t.confirmButton}
        handlePress={handleResetPassword}
        isLoading={isLoading}
      />

      <ErrorModal
        isVisible={isModalVisible}
        message={errorMessage}
        onClose={handleCloseModal}
        isSecuss={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
});

export default ResetPassword;
