import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useUserStore } from "../../store/userStore";
import { getEmailByPhoneNumber, signIn } from "@/lib/api";
import FormField from "@/components/Auth/FormField";
import CustomButton from "@/components/ui/CustomButton";
import ErrorModal from "@/components/ui/ErrorModal";
import Toast from "react-native-toast-message";
import { translationLogin } from "@/constants/lang";

// Translation object

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ phone: "", password: "" });
  const [fieldError, setFieldError] = useState({
    phone: false,
    password: false,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { fetchBasicUserData, language } = useUserStore();
  const t = translationLogin[language]; // Get translations based on selected language

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: t.login,
      text2: t.loginWelcome,
    });
  };

  const showError = (message: string, isSuccess: boolean = false) => {
    setErrorMessage(message);
    setIsSuccess(isSuccess);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setErrorMessage("");
  };

  const handleChangeText = (field: string, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
    setFieldError((prevError) => ({ ...prevError, [field]: false }));
  };

  const handleSubmit = async () => {
    const { phone, password } = form;

    if (!phone.trim() || !password.trim()) {
      setFieldError({
        phone: !phone.trim(),
        password: !password.trim(),
      });
      showError(t.errorFields, false);
      return;
    }

    setLoading(true);
    try {
      const phoneRegex = /^[0-9]{9}$/;
      if (!phoneRegex.test(phone)) {
        setFieldError((prev) => ({ ...prev, phone: true }));
        showError(t.invalidPhone, false);
        return;
      }

      const email = await getEmailByPhoneNumber(`+966${phone.trim()}`);
      if (!email) {
        setFieldError((prev) => ({ ...prev, phone: true }));
        showError(t.userNotFound, false);
        return;
      }

      await signIn(email, password.trim());
      await fetchBasicUserData();
      showToast();
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Error during sign-in:", error.message);
      showError(error.message || t.loginError, false);
    } finally {
      setLoading(false);
    }
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
        <View className="bg-secondary flex-1 w-full px-4 py-2 justify-start items-center">
          <View className="w-full items-center py-10">
            <FormField
              title={"Phone"}
              placeholder={t.phonePlaceholder}
              value={form.phone}
              handleChangeText={(value) => handleChangeText("phone", value)}
              length={9}
            />
            <FormField
              title={"Password"}
              placeholder={t.passwordPlaceholder}
              value={form.password}
              handleChangeText={(value) => handleChangeText("password", value)}
            />
            <View className="w-full px-2 flex-row-reverse justify-start items-center">
              <TouchableOpacity
                className="flex-row px-3"
                onPress={() => router.push("/(auth)/reset/email")}
              >
                <Text className="text-[#F61F1F] text-xs underline">
                  {t.forgotPassword}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full items-center flex-grow pt-2">
            <CustomButton
              title={t.login}
              handlePress={handleSubmit}
              containerStyles="my-2"
              isLoading={loading}
            />
            <CustomButton
              title={t.guestLogin}
              con
              handlePress={() => router.push("/(tabs)/home")}
              containerStyles="bg-[#E4E4E4] my-2"
              textStyles="text-textDark"
            />
          </View>
        </View>
        <ErrorModal
          isVisible={isModalVisible}
          message={errorMessage}
          onClose={handleClose}
          isSecuss={isSuccess}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
