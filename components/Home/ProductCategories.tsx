import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { icons } from "@/constants";
import { useUserStore } from "@/store/userStore";

interface Category {
  id: number;
  imageUrl: any; // Image source type
  title: { ar: string; en: string; fr: string }; // Titles for multiple languages
  category: string;
}

const ProductCategories: React.FC = () => {
  const router = useRouter();
  const { language } = useUserStore();

  // List of categories with translations
  const [categories] = useState<Category[]>([
    {
      id: 1,
      imageUrl: icons.devices,
      title: { ar: "الأجهزة", en: "Devices", fr: "Appareils" },
      category: "devices",
    },
    {
      id: 2,
      imageUrl: icons.real_estate,
      title: { ar: "العقارات", en: "Real Estate", fr: "Immobilier" },
      category: "real_estate",
    },
    {
      id: 3,
      imageUrl: icons.cars,
      title: { ar: "السيارات", en: "Cars", fr: "Voitures" },
      category: "cars",
    },
    {
      id: 4,
      imageUrl: icons.home_appliance,
      title: {
        ar: "أدوات منزلية",
        en: "Home Appliances",
        fr: "Électroménager",
      },
      category: "home_appliance",
    },
    {
      id: 5,
      imageUrl: icons.jobs,
      title: { ar: "اعمال", en: "Jobs", fr: "Emplois" },
      category: "jobs",
    },
    {
      id: 6,
      imageUrl: icons.personal_items,
      title: {
        ar: "مستلزمات",
        en: "Personal Items",
        fr: "Articles Personnels",
      },
      category: "personal_items",
    },
  ]);

  return (
    <View className="mb-2 pt-1">
      <View className="h-24 relative">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => (
            <View
              className="flex items-center justify-center mx-2"
              key={item.id}
            >
              <TouchableOpacity
                className="p-6 bg-[#E4E4E4] rounded-full items-center justify-center"
                style={{ width: 45, height: 45 }}
                onPress={() =>
                  router.push({
                    pathname: "/screens/Home/details/FilterPage",
                    params: {
                      category: item.category,
                      title: item.title[language],
                    },
                  })
                }
              >
                <Image
                  source={item.imageUrl}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text className="text-center text-[12px] text-texttt font-zainBold mt-2">
                {item.title[language]}{" "}
                {/* Display title in selected language */}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

export default ProductCategories;
