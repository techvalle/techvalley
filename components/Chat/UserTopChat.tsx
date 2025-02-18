import { icons } from "@/constants";
import { checkUserStatus } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

type Lang = "ar" | "en" | "fr";

interface UserTopChatProps {
  avatar: string | null;
  name: string | null;
  otherUserId: string | null;
  language?: Lang;
}

const UserTopChat: React.FC<UserTopChatProps> = ({
  avatar,
  name,
  otherUserId,
  language = "en", // Default to English
}) => {
  const [isToggled, setIsToggled] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Translations for online/offline status
  const translations: Record<Lang, { online: string; offline: string }> = {
    en: { online: "Online", offline: "Offline" },
    ar: { online: "متصل", offline: "غير متصل" },
    fr: { online: "En ligne", offline: "Hors ligne" },
  };

  // Fetch user status asynchronously
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const status = await checkUserStatus(otherUserId || "");
        setIsOnline(status);
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    if (otherUserId) {
      fetchUserStatus();
    }
  }, [otherUserId]);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <View className="flex-row-reverse border-b-[1px] border-b-[#cfcfcf] py-3 px-1 mb-4">
      <View className="flex-row-reverse items-center">
        {avatar && (
          <Image
            source={{
              uri: avatar,
            }}
            className="w-12 h-12 rounded-full ml-4"
            resizeMode="cover"
          />
        )}
        {!avatar && (
          <Image
            source={icons.profile}
            className="w-12 h-12 rounded-full ml-4"
            resizeMode="cover"
          />
        )}

        <View className="pt-1 justify-center items-end">
          <Text className="text-primary ml-4 font-sans-arabic-semibold text-[17px] mb-1">
            {name || ""}
          </Text>
          <View className="flex-row-reverse gap-x-1">
            <View className="flex-row-reverse justify-center items-center">
              <View
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-700"
                }`}
              ></View>
            </View>
            <View className="flex-row-reverse justify-center items-center">
              <Text style={{ fontSize: 10 }}>
                {isOnline
                  ? translations[language].online
                  : translations[language].offline}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex-grow flex-row justify-start items-center">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggle}
          className="flex justify-center items-center p-4 w-6 h-6 rounded-full ml-2"
        >
          <Image
            source={icons.add}
            className={`w-6 h-6`}
            tintColor={isToggled ? "#FF6E4E" : "#A4A4A4"}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserTopChat;
