import FormField from "@/components/Auth/FormField";
import VerificationPage from "@/components/Auth/VerificationPage";
import CustomButton from "@/components/ui/CustomButton";
import ErrorModal from "@/components/ui/ErrorModal";
import { translationSignUp } from "@/constants/lang";
import { isEmailExisting, isPhoneNumberExisting } from "@/lib/api";
import { UpdatePhoneNumberAndSendOTP } from "@/lib/UpdatePhoneNumberAndSendOTP";
import { useUserStore } from "@/store/userStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Switch,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";

// Translation object

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    passwordsure: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { language } = useUserStore(); // Assuming language state is in user store
  const t = translationSignUp[language]; // Get translations based on selected language

  const showError = (message: string, isSuccess: boolean) => {
    setErrorMessage(message);
    setIsSuccess(isSuccess);
    setIsModalVisible(true);
  };

  const handleCloseErrorModal = () => {
    setIsModalVisible(false);
    setErrorMessage("");
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: t.signUp,
      text2: t.signupWelcome,
    });
  };

  const handleChangeText = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    const { name, phone, email, password, passwordsure } = form;

    if (!name || !phone || !email || !password || !passwordsure) {
      showError(t.fieldError, false);
      return;
    }

    if (password !== passwordsure) {
      showError(t.passwordMismatch, false);
      return;
    }

    if (!email.includes("@")) {
      showError(t.invalidEmail, false);
      return;
    }

    try {
      setIsSubmitting(true);

      const phoneExists = await isPhoneNumberExisting(`+966${phone}`);
      if (phoneExists) {
        showError(t.phoneExists, false);
        return;
      }

      const emailExists = await isEmailExisting(email);
      if (emailExists) {
        showError(t.emailExists, false);
        return;
      }

      await UpdatePhoneNumberAndSendOTP(form);
      setShowOtpModal(true);
    } catch (error: any) {
      console.error("Error during sign-up:", error.message || error);
      showError(t.signupError, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    showToast();
    router.replace("/(tabs)/home");
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex justify-center items-center">
          <FormField
            title={"Name"}
            placeholder={t.namePlaceholder}
            value={form.name}
            handleChangeText={(value) => handleChangeText("name", value)}
          />
          <FormField
            title={"Email"}
            placeholder={t.emailPlaceholder}
            value={form.email}
            handleChangeText={(value) => handleChangeText("email", value)}
          />
          <FormField
            title={"Phone"}
            length={9}
            placeholder={t.phonePlaceholder}
            value={form.phone}
            handleChangeText={(value) => handleChangeText("phone", value)}
          />
          <FormField
            title={"Password"}
            placeholder={t.passwordPlaceholder}
            value={form.password}
            handleChangeText={(value) => handleChangeText("password", value)}
          />
          <FormField
            title={"Password"}
            placeholder={t.confirmPasswordPlaceholder}
            value={form.passwordsure}
            handleChangeText={(value) =>
              handleChangeText("passwordsure", value)
            }
          />

          <View className="flex-row-reverse justify-start items-center w-full px-6 ">
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ true: "#FF6E4E" }}
            />
            <Text>
              {t.agreeText}{" "}
              <Text
                className="text-primary"
                onPress={() => router.push("/(auth)/TermsPage")}
              >
                {t.policiesText}
              </Text>
            </Text>
          </View>

          <CustomButton
            title={t.signUp}
            isDisable={!isEnabled}
            handlePress={handleSubmit}
            isLoading={isSubmitting}
          />
        </View>

        {showOtpModal && (
          <VerificationPage
            ismodal={showOtpModal}
            forcreat={true}
            isphone={true}
            form={form}
            close={closeOtpModal}
            onSuccess={handleOtpSuccess}
          />
        )}
        <ErrorModal
          isVisible={isModalVisible}
          message={errorMessage}
          onClose={handleCloseErrorModal}
          isSecuss={isSuccess}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
