import React, { useState, useEffect } from "react";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { StatusBar } from "expo-status-bar";

import OtpInputs from "react-native-otp-inputs-expo";
import { icons } from "../../constants";
import { UpdatePhoneNumberAndSendOTP } from "@/lib/UpdatePhoneNumberAndSendOTP";
import { createUser, sendOtpToEmail, updatePhoneNumber } from "@/lib/api";
import CustomButton from "../ui/CustomButton";
import CustomOtpInputs from "./CustomOtpInputs";
import ErrorModal from "../ui/ErrorModal";
import { useUserStore } from "@/store/userStore";
import { translationsVerificationSignup } from "@/constants/lang";

interface VerificationPageProps {
  ismodal: boolean;
  close: () => void;
  form: any;
  onSuccess?: () => void;
  forcreat: boolean;
  isphone: boolean;
}

const VerificationPage: React.FC<VerificationPageProps> = ({
  ismodal,
  close,
  form,
  onSuccess,
  forcreat,
  isphone,
}) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPressed, setHasPressed] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSecuss, setIsSecuss] = useState(false);

  const { language } = useUserStore(); // Assuming `language` state exists
  const t = translationsVerificationSignup[language]; // Get translations for current language

  const phoneOrEmail = isphone ? `+966${form?.phone}` : form.email;

  useEffect(() => {
    setOtp(""); // Reset OTP input on modal open/close
  }, [ismodal]);

  const showError = (message: string, isSecusss: boolean) => {
    setErrorMessage(message);
    setIsSecuss(isSecusss);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setErrorMessage("");
  };

  const resendCode = () => {
    if (isphone && !hasPressed) {
      UpdatePhoneNumberAndSendOTP(form);
      setHasPressed(true);
    } else {
      sendOtpToEmail(form.email);
    }
  };

  const closeAndRedirect = () => {
    setIsModalVisible(false);
    setHasPressed(false);
    close();
  };

  const verifyOtp = async () => {
    if (otp.length < 4) return showError(t.enterOtp, false);

    const AUTH_KEY =
      "$2y$10$c57cHaWGuddWl/V/9MzDGOoguNMw.FR5A5cVi7kzysgWGGgPQgXv2";
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://api.authentica.sa/api/sdk/v1/verifyOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Authorization": AUTH_KEY || "",
          },
          body: JSON.stringify({ phone: phoneOrEmail, otp }),
        }
      );

      if (!response.ok) throw new Error(t.otpFailed);

      if (forcreat && isphone) {
        await createUser(form.email, form.password, form.name, phoneOrEmail);
        await updatePhoneNumber(phoneOrEmail, form.password);
      }

      setIsModalVisible(false);
      onSuccess && onSuccess();
    } catch (error) {
      showError(t.otpFailed, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isVisible={ismodal} useNativeDriver>
      <View className="bg-white p-5 rounded-lg items-center">
        <TouchableOpacity
          onPress={closeAndRedirect}
          className="absolute top-3 right-3"
        >
          <Image source={icons.close} className="w-6 h-6" />
        </TouchableOpacity>
        <Image source={icons.sendpassLogo} className="w-36 h-48" />

        <Text className="mt-4 mb-2 text-primary text-base">
          {isphone ? t.verifyPhone : t.verifyEmail}
        </Text>
        <Text className="mb-5 text-textLight">{phoneOrEmail}</Text>

        <CustomOtpInputs
          numberOfInputs={4}
          onChangeOtp={(otp) => setOtp(otp)}
        />

        <CustomButton
          title={t.continue}
          handlePress={verifyOtp}
          isLoading={isSubmitting}
        />

        <TouchableOpacity onPress={resendCode} disabled={hasPressed}>
          <Text className="text-primary mt-4">
            {hasPressed ? t.codeResent : t.resendCode}
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="dark" />
      <ErrorModal
        isVisible={isModalVisible}
        message={errorMessage}
        onClose={handleClose}
        isSecuss={isSecuss}
        language={language}
      />
    </Modal>
  );
};

export default VerificationPage;
