import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useUserStore } from "@/store/userStore";
import NavTop from "@/components/Product/NavTop";
import ProfileTop from "@/components/profile/ProfileTop";
import CardP from "@/app/screens/Profile/CardP";
import CustomButton from "@/components/ui/CustomButton";
import Modal from "react-native-modal";

// Translations
const translations = {
  ar: {
    accountInfo: "معلومات حسابي",
    signOut: "تسجيل الخروج",
    signOutError: "حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.",
    confirmSignOut: "تأكيد تسجيل الخروج",
    confirmMessage: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    yes: "نعم",
    no: "لا",
  },
  en: {
    accountInfo: "My Account Information",
    signOut: "Sign Out",
    signOutError: "Error signing out. Please try again.",
    confirmSignOut: "Confirm Sign Out",
    confirmMessage: "Are you sure you want to sign out?",
    yes: "Yes",
    no: "No",
  },
  fr: {
    accountInfo: "Informations de mon compte",
    signOut: "Se déconnecter",
    signOutError: "Erreur lors de la déconnexion. Veuillez réessayer.",
    confirmSignOut: "Confirmer la déconnexion",
    confirmMessage: "Êtes-vous sûr de vouloir vous déconnecter ?",
    yes: "Oui",
    no: "Non",
  },
};

const Profile: React.FC = () => {
  const { user, language, signOutUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const t = translations[language] || translations.en; // Fallback to English

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const SignOut = async () => {
    if (!user) {
      console.error("Error during sign-out: user is null or undefined.");
      router.replace("/(auth)");
      return;
    }

    setIsLoading(true);

    try {
      await signOutUser();
      router.replace("/(auth)");
    } catch (error) {
      console.error("Error during sign-out:", error);
      Alert.alert(t.signOutError);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <SafeAreaView className="w-full h-full bg-bgcolor px-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <NavTop
          title={t.accountInfo}
          containerS="h-14 w-14 mr-0 mt-2 bg-bgcolor"
          logo
        />
        {user && <ProfileTop user={user as any} />}

        <CardP UserId={user?.$id} language={language} />
        <View className="items-center justify-center mb-10">
          <CustomButton
            title={t.signOut}
            loguot
            handlePress={SignOut}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>

      {/* Modal for Confirm Sign-Out */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        backdropOpacity={0.5}
        useNativeDriver
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t.confirmSignOut}</Text>
          <Text style={styles.modalMessage}>{t.confirmMessage}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              disabled={isLoading}
              onPress={toggleModal}
            >
              <Text style={styles.cancelText}>{t.no}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              disabled={isLoading}
              onPress={SignOut}
            >
              <Text style={styles.confirmText}>{t.yes}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#FF6E4E",
  },
  cancelText: {
    color: "#555",
    fontWeight: "bold",
  },
  confirmText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Profile;
