import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { useRouter } from "expo-router";
import { useUserStore } from "@/store/userStore";
import { updateUser, updateUserProfileImage } from "@/lib/api";
import SafeAreaScrollView from "@/components/ui/SafeAreaScrollView";
import NavTop from "@/components/Product/NavTop";
import { icons } from "@/constants";
import CardName from "@/components/profile/CardName";
import StarRating from "@/components/profile/StarRating";
import CustomInputP from "@/components/profile/CustomInputP";
import BirthdayPicker from "@/components/profile/BirthdayPicker";
import GenderSelection from "@/components/profile/GenderSelection";
import CustomButtonProfile from "@/components/profile/CustomButtonProfile";

interface ProfileImage {
  uri: string;
  mimeType: string;
  name: string;
  size: number;
}

const EditProfile: React.FC = () => {
  const { user, language, updateUserData } = useUserStore();
  const router = useRouter();

  const translations = {
    en: {
      title: "Edit Profile",
      save: "Save",
      namePlaceholder: "Enter your name",
      emailPlaceholder: "Enter your email",
      phonePlaceholder: "Enter your phone number",
      rating: "Rating",
      followers: "Followers",
      profileUpdated: "Profile Updated",
      profileUpdatedMessage: "Your profile has been updated successfully!",
      permissionDenied: "Permission Denied",
      permissionMessage: "Permission to access media library is required.",
      noImageSelected: "No Image Selected",
      noImageMessage: "You did not select an image.",
      fileTooLarge: "File Too Large",
      fileTooLargeMessage: "Please select an image smaller than 5MB.",
      error: "Error",
    },
    fr: {
      title: "Modifier le profil",
      save: "Sauvegarder",
      namePlaceholder: "Entrez votre nom",
      emailPlaceholder: "Entrez votre email",
      phonePlaceholder: "Entrez votre numéro de téléphone",
      rating: "Évaluation",
      followers: "Abonnés",
      profileUpdated: "Profil mis à jour",
      profileUpdatedMessage: "Votre profil a été mis à jour avec succès!",
      permissionDenied: "Autorisation refusée",
      permissionMessage:
        "L'autorisation d'accéder à la bibliothèque multimédia est requise.",
      noImageSelected: "Aucune image sélectionnée",
      noImageMessage: "Vous n'avez pas sélectionné d'image.",
      fileTooLarge: "Fichier trop volumineux",
      fileTooLargeMessage: "Veuillez sélectionner une image inférieure à 5 Mo.",
      error: "Erreur",
    },
    ar: {
      title: "تعديل الملف الشخصي",
      save: "حفظ",
      namePlaceholder: "ادخل اسمك",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      phonePlaceholder: "أدخل رقم هاتفك",
      rating: "التقييم",
      followers: "المتابعين",
      profileUpdated: "تم تحديث الملف الشخصي",
      profileUpdatedMessage: "تم تحديث ملفك الشخصي بنجاح!",
      permissionDenied: "تم رفض الإذن",
      permissionMessage: "يتطلب الإذن للوصول إلى مكتبة الوسائط.",
      noImageSelected: "لم يتم تحديد صورة",
      noImageMessage: "لم تقم بتحديد صورة.",
      fileTooLarge: "الملف كبير جدًا",
      fileTooLargeMessage: "يرجى تحديد صورة أصغر من 5 ميغابايت.",
      error: "خطأ",
    },
  };

  const t = translations[language || "en"];

  if (!user) {
    router.replace("/(auth)");
    return null;
  }

  const [name, setName] = useState<string>(user?.Details?.name || "");
  const [birthDay, setBirthday] = useState<string>(
    user?.Details?.birthDay || ""
  );
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phone || "");
  const [gender, setGender] = useState<string>(user?.Details?.gender || "");
  const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleGenderChange = (selectedGender: string) => {
    setGender(selectedGender);
  };

  const handleDateChange = (selectedDate: Date) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    setBirthday(formattedDate);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t.permissionDenied, t.permissionMessage);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) {
        Alert.alert(t.noImageSelected, t.noImageMessage);
        return;
      }

      const selectedImage = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri);

      if (!fileInfo.exists || fileInfo.size > 5 * 1024 * 1024) {
        Alert.alert(t.fileTooLarge, t.fileTooLargeMessage);
        return;
      }

      const { uri, mimeType = "image/jpeg" } = selectedImage;

      setProfileImage({
        uri: uri,
        mimeType: mimeType || "image/jpeg",
        name: selectedImage.fileName || "uploaded_image.jpg",
        size: fileInfo.size,
      });
    } catch (error: any) {
      console.error("Error picking image:", error);
      Alert.alert(t.error, `Something went wrong: ${error.message}`);
    }
  };

  const saveChanges = async () => {
    try {
      const { Details, $id } = user || {};
      if (!$id) throw new Error("User ID is null or undefined.");

      let imageUrl = Details?.imageUrl;
      setIsUploading(true);

      if (profileImage?.uri) {
        imageUrl = await updateUserProfileImage(profileImage);
      }

      const details = {
        name,
        birthDay,
        gender,
        imageUrl,
        Rates: "0",
        address: "0",
        views: Details?.views || 0,
      } as any;

      await updateUser(details, $id);
      updateUserData({ name, birthDay, gender, imageUrl, address: "0" });

      Alert.alert(t.profileUpdated, t.profileUpdatedMessage);
      router.replace("/Profile");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert(t.error, `Something went wrong: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaScrollView style={styles.container} className="bg-bgcolor">
      <NavTop title={t.title} />
      <View style={styles.profileSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={pickImage}
          style={styles.profileImageWrapper}
        >
          <View style={styles.cameraIconWrapper}>
            <Image source={icons.profileCam} style={styles.cameraIcon} />
          </View>
          <View>
            {isUploading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : profileImage ? (
              <Image
                source={{ uri: profileImage.uri }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={{ uri: user?.Details?.imageUrl }}
                style={styles.profileImage}
              />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.userName}</Text>
        {/* <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <CardName icon={icons.starpp} title={t.rating} />
            <StarRating rating={4.5} />
          </View>
          <View style={styles.stat}>
            <CardName icon={icons.profileppp} title={t.followers} />
            <Text>312</Text>
          </View>
        </View> */}
      </View>
      <CustomInputP
        value={name}
        type="p"
        lang={language}
        onChangeText={setName}
        placeholder={t.namePlaceholder}
      />
      <BirthdayPicker birthDay={birthDay} onDateChange={handleDateChange} />
      <CustomInputP
        type="p"
        value={email}
        edit={false}
        lang={language}
        onChangeText={setEmail}
        placeholder={t.emailPlaceholder}
        keyboardType="email-address"
      />
      <CustomInputP
        type="f"
        value={phoneNumber}
        edit={false}
        lang={language}
        onChangeText={setPhoneNumber}
        placeholder={t.phonePlaceholder}
      />
      <GenderSelection
        onGenderChange={handleGenderChange}
        selectedGender={gender}
        lang={language}
      />
      <CustomButtonProfile
        handlePress={saveChanges}
        title={t.save}
        isLoading={isUploading}
        containerStyles={styles.saveButton}
      />
    </SafeAreaScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  profileSection: {
    width: "100%",
  },
  profileImageWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
    marginBottom: 8,
    position: "relative",
  },
  cameraIconWrapper: {
    position: "absolute",
    bottom: 4,
    left: 4,
    zIndex: 30,
  },
  cameraIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  userName: {
    textAlign: "center",
    color: "#888",
    marginVertical: 4,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "75%",
    alignSelf: "center",
  },
  stat: {
    width: "45%",
    alignItems: "center",
    padding: 8,
  },
  saveButton: {
    marginTop: 19,
    width: "75%",
    alignSelf: "center",
  },
});

export default EditProfile;
