import NavTop from "@/components/Product/NavTop";
import CustomButton from "@/components/ui/CustomButton";
import CustomPickerV2 from "@/components/ui/CustomPickerV2";
import { languages } from "@/constants";
import { useUserStore } from "@/store/userStore";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangeLang: React.FC = () => {
  const { language, setLanguage } = useUserStore();
  const [selectedLang, setSelectedLang] = useState<string>(language);

  const handleSave = () => {
    if (selectedLang) setLanguage(selectedLang);
  };

  const getLabelText = (lang: string): string => {
    switch (lang) {
      case "en":
        return "Select Language";
      case "fr":
        return "Sélectionnez la langue";
      case "ar":
        return "اختر اللغة";
      default:
        return "Select Language";
    }
  };

  return (
    <SafeAreaView className="bg-secondary h-full">
      <View style={{ paddingHorizontal: 20 }}>
        <NavTop title={getLabelText(language)} />

        {/* Language Picker */}
        <CustomPickerV2
          language={language}
          label={getLabelText(language)}
          items={languages.map((item: any) => ({
            value: item.value,
            label: item.label,
          }))}
          value={selectedLang}
          onValueChange={(value) => setSelectedLang(value as any)}
          containerStyle={{ marginBottom: 20 }}
        />

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

export default ChangeLang;
