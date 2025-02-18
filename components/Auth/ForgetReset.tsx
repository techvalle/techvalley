import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { router } from "expo-router";
import {
  isEmailExisting,
  isPhoneNumberExisting,
  sendOtpToEmail,
  sendOtpToPhone,
} from "@/lib/api";
import FormField from "./FormField";
import CustomButton from "../ui/CustomButton";
import VerifictionEandP from "./VerifictionEandP";
import ErrorModal from "../ui/ErrorModal";
import { useUserStore } from "@/store/userStore";
import { translationForget } from "@/constants/lang";

interface ForgetResetProps {
  type: "email" | "phone";
  onSuccessRedirect?: string;
}

const ForgetReset: React.FC<ForgetResetProps> = ({
  type,
  onSuccessRedirect = "/(auth)", // Default redirect route
}) => {
  const [form, setForm] = useState({ value: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [userId, setUserId] = useState("");

  const { language } = useUserStore(); // Assuming language state is in user store

  const isPhone = type === "phone";
  const t = translationForget[language]; // Get translations based on current language

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const showError = (message: string, success: boolean) => {
    setErrorMessage(message);
    setIsSuccess(success);
    setErrorModalVisible(true);
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
  };

  const handleChangeText = (value: string) => {
    setForm({ value });
  };

  const handleBackPress = () => {
    router.replace("/(auth)");
    setErrorModalVisible(false);
  };

  const handleSendOtp = async () => {
    if (!form.value.trim()) {
      showError(t.errorEmptyField, false);
      return;
    }

    setIsLoading(true);
    const formattedValue = isPhone
      ? `+966${form.value.trim()}`
      : form.value.trim();

    try {
      if (isPhone) {
        const phoneExists = await isPhoneNumberExisting(formattedValue);
        if (!phoneExists) {
          showError(t.errorPhoneNotFound, false);
          return;
        }
        const userIdFromPhone = await sendOtpToPhone(formattedValue);
        setUserId(userIdFromPhone);
      } else {
        const emailExists = await isEmailExisting(formattedValue);
        if (!emailExists) {
          showError(t.errorEmailNotFound, false);
          return;
        }
        await sendOtpToEmail(formattedValue);
      }

      setIsOtpModalVisible(true);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      showError(t.sendOtpError, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    setIsOtpModalVisible(false);
    setErrorModalVisible(true);
    router.replace("/(auth)/reset/ResetPassword");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <SafeAreaView style={{ flex: 1 }} className="bg-secondary">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          keyboardShouldPersistTaps="handled"
          className="w-full h-full bg-secondary"
        >
          {/* Back Button */}
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
              paddingHorizontal: 20,
              paddingTop: 5,
              paddingBottom: 50,
            }}
          >
            <TouchableOpacity onPress={handleBackPress}>
              <Image
                source={icons.backArrow}
                className="w-6 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Page Content */}
          <Image
            source={icons.passLogo}
            resizeMode="contain"
            className="w-52 h-48"
          />
          <Text className="font-sans-arabic-bold text-textDark mt-6 mb-12">
            {isPhone ? t.enterPhone : t.enterEmail}
          </Text>
          <FormField
            title={isPhone ? "Phone" : "Email"}
            placeholder={isPhone ? t.phoneLabel : t.emailLabel}
            value={form.value}
            handleChangeText={handleChangeText}
            length={isPhone ? 9 : undefined}
          />
          <View className="w-full px-2 pr-3 pt-1 flex-row-reverse justify-start items-center mb-20">
            <TouchableOpacity
              className="flex-row px-3"
              onPress={() =>
                router.replace(
                  isPhone ? "/(auth)/reset/email" : "/(auth)/reset/phone"
                )
              }
            >
              <Text className="text-[#F61F1F] text-xs">
                {isPhone ? t.emailLabel : t.phoneLabel}
              </Text>
            </TouchableOpacity>
          </View>
          <CustomButton
            title={t.continue}
            isLoading={isLoading}
            handlePress={handleSendOtp}
          />
        </ScrollView>
        {/* OTP Verification Modal */}
        {isOtpModalVisible && (
          <VerifictionEandP
            ismodal={isOtpModalVisible}
            form={{ value: form.value }}
            userId={userId}
            close={() => setIsOtpModalVisible(false)}
            onSuccess={handleOtpSuccess}
            isphone={isPhone}
          />
        )}
        {/* Error Modal */}
        <ErrorModal
          isVisible={errorModalVisible}
          message={errorMessage}
          onClose={handleErrorModalClose}
          isSecuss={isSuccess}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ForgetReset;
