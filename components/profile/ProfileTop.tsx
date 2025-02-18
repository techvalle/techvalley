import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import CardName from "./CardName";
import { formatViews, icons } from "../../constants";
import { fetchProductViewers } from "@/lib/api";
import { AppwriteDocument } from "@/types/appwriteTypes";

interface ProfileTopProps {
  user: AppwriteDocument | null; // Accepts a User object or null
}

// Translations for labels
const translations = {
  en: {
    views: "Views",
  },
  ar: {
    views: "مشاهدات",
  },
  fr: {
    views: "Vues",
  },
};

const ProfileTop: React.FC<ProfileTopProps> = ({ user }) => {
  const [view, setView] = useState<number>(0);
  const [language, setLanguage] = useState<"en" | "ar" | "fr">("en"); // Current language state

  // Fetch unique viewers
  const displayUniqueViewers = async (user: AppwriteDocument | null) => {
    try {
      if (user?.$id) {
        const viewers = await fetchProductViewers(user?.$id);
        setView(viewers?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching unique viewers:", error);
    }
  };

  useEffect(() => {
    displayUniqueViewers(user);
  }, [user]);

  const t = translations[language]; // Get translations for the current language

  return (
    <View className="items-center flex-row-reverse justify-between mx-2">
      <View className="flex-row-reverse">
        <Image
          source={{ uri: user?.Details?.imageUrl || icons.profileIn }}
          className="w-12 h-12 rounded-full ml-4"
          resizeMode="cover"
        />
        <View className="pt-1">
          <Text className="text-primary ml-4 font-sans-arabic-semibold">
            {user?.Details?.name}
          </Text>
          <Text className="text-textLight ml-4 font-sans-arabic-semibold">
            {user?.userName}
          </Text>
        </View>
      </View>
      <View className="justify-center items-center py-2">
        <CardName title={t.views} icon={icons.pfire} />
        <Text className="font-sans-arabic-light text-black text-2xl">
          {formatViews(view, language)}
        </Text>
      </View>
    </View>
  );
};

export default ProfileTop;
