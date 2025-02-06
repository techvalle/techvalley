import React from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import { useUserStore } from "@/store/userStore";
import { translationTerms } from "@/constants/lang";

export default function TermsPage() {
  const { language } = useUserStore(); // Assuming language state is in user store
  const t = translationTerms[language]; // Get translations based on selected language

  return (
    <SafeAreaView>
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <View className="flex-1 bg-white p-4 space-y-1">
          {/* Header with back icon */}
          <View className="flex-row-reverse items-center mb-4">
            <TouchableOpacity onPress={() => router.back()} className="mr-0">
              <Image
                source={icons.backArrow}
                className="w-6 h-5 mt-2"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View className="items-center justify-center mb-5">
            <Image
              source={icons.logo}
              className={`w-28 h-20 `}
              resizeMode="contain"
            />
            <Text className="text-primary font-sans-arabic-bold text-lg">
              {t.title}
            </Text>
          </View>

          {/* Content */}
          <Text className="text-lg text-right">{t.introduction}</Text>
          <Text className="text-lg text-right mt-4">{t.articleOne}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
