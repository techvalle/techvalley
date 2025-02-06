import ListC from "@/components/profile/ListC";
import { icons } from "@/constants";
import React from "react";
import { View } from "react-native";

// Define translations for ar, en, and fr
const translations = {
  en: {
    myInfo: "My Information",
    likes: "Likes",
    address: "Address",
    about: "About Tashkem",
    shareApp: "Share App",
    terms: "Terms and Conditions",
    language: "Language",
    support: "Support",
  },
  ar: {
    myInfo: "معلوماتي",
    likes: "اعجبني",
    address: "العنوان",
    about: "عن تشكم",
    shareApp: "مشاركة التطبيق",
    terms: "السياسة والشروط والأحكام",
    language: "اللغة",
    support: "الدعم الفني",
  },
  fr: {
    myInfo: "Mes Informations",
    likes: "J'aime",
    address: "Adresse",
    about: "À propos de Tashkem",
    shareApp: "Partager l'application",
    terms: "Conditions générales",
    language: "Langue",
    support: "Assistance",
  },
};

// Define props interface
interface CardPProps {
  UserId?: string | null;
  language: "en" | "ar" | "fr"; // Language prop
}

const CardP: React.FC<CardPProps> = ({ UserId, language }) => {
  const t = translations[language]; // Get translations based on the language

  return (
    <View className="px-5 pt-5 pb-3 bg-bgcolor rounded-xl mb-4 mt-2 border-[#D2D2D2] border-[1px]">
      {UserId && (
        <ListC
          icon={icons.lprofile}
          title={t.myInfo}
          to={"screens/Profile/updateProfile"}
          language={language}
        />
      )}
      {UserId && (
        <ListC
          icon={icons.llove}
          title={t.likes}
          to={"screens/Likes"}
          language={language}
        />
      )}
      {UserId && (
        <ListC
          icon={icons.llocation}
          language={language}
          title={t.address}
          to={"screens/Profile/CityNeighborhoodPicker"}
        />
      )}

      {/* <ListC
        icon={icons.llogo}
        title={t.about}
        to={"home"}
        language={language}
      />
      <ListC
        icon={icons.lshare}
        title={t.shareApp}
        to={"home"}
        language={language}
      /> */}
      <ListC
        icon={icons.lfile}
        title={t.terms}
        to={"(auth)/TermsPage"}
        language={language}
      />
      <ListC
        icon={icons.llang}
        title={t.language}
        to={"screens/Profile/ChangeLang"}
        language={language}
      />
      {/* <ListC
        icon={icons.lsupport}
        title={t.support}
        to={"home"}
        language={language}
      /> */}
    </View>
  );
};

export default CardP;
