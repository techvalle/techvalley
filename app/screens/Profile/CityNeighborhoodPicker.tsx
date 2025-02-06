import React, { useState } from "react";
import { View, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useUserStore } from "@/store/userStore";
import NavTop from "@/components/Product/NavTop";
import CustomPickerV2 from "@/components/ui/CustomPickerV2";
import CustomButton from "@/components/ui/CustomButton";
import { chadCities } from "@/constants";
import { translationCreate } from "@/constants/lang";

// const neighborhoods = {
//   new_york: {
//     en: [
//       { label: "Manhattan", value: "manhattan" },
//       { label: "Brooklyn", value: "brooklyn" },
//     ],
//     ar: [
//       { label: "مانهاتن", value: "manhattan" },
//       { label: "بروكلين", value: "brooklyn" },
//     ],
//     fr: [
//       { label: "Manhattan", value: "manhattan" },
//       { label: "Brooklyn", value: "brooklyn" },
//     ],
//   },
//   los_angeles: {
//     en: [
//       { label: "Hollywood", value: "hollywood" },
//       { label: "Downtown", value: "downtown" },
//     ],
//     ar: [
//       { label: "هوليوود", value: "hollywood" },
//       { label: "وسط المدينة", value: "downtown" },
//     ],
//     fr: [
//       { label: "Hollywood", value: "hollywood" },
//       { label: "Centre-ville", value: "downtown" },
//     ],
//   },
//   chicago: {
//     en: [
//       { label: "Loop", value: "loop" },
//       { label: "Hyde Park", value: "hyde_park" },
//     ],
//     ar: [
//       { label: "لوب", value: "loop" },
//       { label: "هايد بارك", value: "hyde_park" },
//     ],
//     fr: [
//       { label: "Loop", value: "loop" },
//       { label: "Hyde Park", value: "hyde_park" },
//     ],
//   },
// };

const CityNeighborhoodPicker: React.FC = () => {
  const { language, user, updateUserCity } = useUserStore();

  const [selectedCity, setSelectedCity] = useState<string | null>(
    user?.city || null
  );
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<
    string | null
  >(null);

  if (!user) {
    router.replace("/(auth)");
    return null;
  }

  const t = translationCreate[language];

  const handleSave = async () => {
    if (!selectedCity) {
      Alert.alert(
        language === "ar" ? "خطأ" : language === "fr" ? "Erreur" : "Error",
        language === "ar"
          ? "الرجاء اختيار المدينة والحي"
          : language === "fr"
          ? "Veuillez sélectionner une ville et un quartier."
          : "Please select both city and neighborhood."
      );
    } else {
      await updateUserCity(selectedCity);
      Alert.alert(
        language === "ar"
          ? "تم الحفظ"
          : language === "fr"
          ? "Enregistré"
          : "Selections Saved",
        `${
          language === "ar" ? "المدينة" : language === "fr" ? "Ville" : "City"
        }: ${selectedCity}\n${
          language === "ar"
            ? "الحي"
            : language === "fr"
            ? "Quartier"
            : "Neighborhood"
        }: ${selectedNeighborhood}`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bgcolor">
      <View style={{ paddingHorizontal: 20 }}>
        <NavTop
          title={
            language === "ar"
              ? "العنوان"
              : language === "fr"
              ? "Adresse"
              : "Address"
          }
        />

        {/* City Picker */}
        <View className="my-2">
          {/* City Picker */}
          <CustomPickerV2
            label={t.cityPickerLabel}
            items={chadCities}
            value={selectedCity}
            language={language}
            onValueChange={(value) => setSelectedCity(value)}
          />
        </View>

        {/* Neighborhood Picker
        {selectedCity && (
          <CustomPickerV2
            label={
              language === "ar"
                ? "اختار الحي"
                : language === "fr"
                ? "Choisissez votre quartier"
                : "Select Your Neighborhood"
            }
            items={
              neighborhoods[selectedCity]
                ? neighborhoods[selectedCity][language] || []
                : []
            }
            value={selectedNeighborhood}
            placeholder={{
              label:
                language === "ar"
                  ? "اختر حي"
                  : language === "fr"
                  ? "Sélectionnez un quartier"
                  : "Select a neighborhood",
              value: null,
            }}
            onValueChange={(value) => setSelectedNeighborhood(value)}
            containerStyle={{ marginBottom: 20 }}
          />
        )} */}

        {/* Save Button */}
        <CustomButton
          title={
            language === "ar"
              ? "حفظ"
              : language === "fr"
              ? "Enregistrer"
              : "Save"
          }
          handlePress={handleSave}
          containerStyles={"mx-auto"}
        />
      </View>
    </SafeAreaView>
  );
};

export default CityNeighborhoodPicker;
