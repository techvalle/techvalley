import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useUserStore } from "@/store/userStore";
import { fetchBanStatus, recordView } from "@/lib/api";
import calculateTimeAgo from "@/components/Product/calculateTimeAgo";
import GetCityName from "@/components/Product/GetArabicCityName";
import Backbottun from "@/components/Home/Details/Backbottun";
import UserTopHome from "@/components/Home/UserTopHome";
import ProductDetailss from "@/components/Home/Details/ProductDetails";
import BanModal from "@/components/Home/Details/BanModal";
import { useProductStore } from "@/store/productStore";
import ChatD from "@/components/Home/Details/ChatD";
import { translationDetails } from "@/constants/lang";

interface ProductDetailsProps {
  item: string;
  id: string;
}

const ProductDetails: React.FC = () => {
  const { currentProduct } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);
  const { user, language } = useUserStore();

  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [isLoadingg, setIsLoadingg] = useState(true);

  const t = translationDetails[language as keyof typeof translationDetails];

  useEffect(() => {
    const checkBanStatus = async () => {
      if (!user || !currentProduct?.creator?.$id) {
        console.warn(
          "Missing required data to check ban status. Skipping check."
        );
        setIsLoadingg(false);
        return;
      }

      try {
        const { isBanned, reason } = await fetchBanStatus(
          user.$id,
          currentProduct.creator.$id
        );
        setIsBanned(isBanned);
        setBanReason(reason as string);
        setIsLoadingg(false);
      } catch (error) {
        console.error("Error checking ban status:", error);
        setIsLoadingg(false);
      }
    };

    checkBanStatus();
  }, [currentProduct?.creator?.$id]);

  useEffect(() => {
    if (user && currentProduct.$id) {
      recordView(user.$id, currentProduct.$id).catch((err) =>
        console.error("Error recording view:", err)
      );
    }
  }, [user, currentProduct.$id]);

  const handleRedirect = () => {
    router.back();
  };

  const timeAgo = useMemo(() => {
    return currentProduct
      ? calculateTimeAgo(currentProduct.$createdAt, language)
      : "";
  }, [currentProduct, language]);

  const city = useMemo(() => {
    return currentProduct
      ? GetCityName(
          currentProduct.Details?.selectedCity || t.unknownCity,
          language
        )
      : t.unknownCity;
  }, [currentProduct]);

  useEffect(() => {
    if (currentProduct == null) {
      setIsLoading(false);
    }
  }, [currentProduct]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} className="bg-[#FAFAFA]">
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>{t.loading}</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              <Backbottun containerStyle={"m-4"} />
              <View className="bg-white p-4 mb-5">
                <UserTopHome
                  timeAgo={timeAgo}
                  city={city}
                  userId={user?.$id || ""}
                  item={currentProduct}
                />
                {currentProduct.Details ? (
                  <ProductDetailss />
                ) : (
                  <Text>{t.noDetails}</Text>
                )}
              </View>
              <Text
                className={`text-primary fon text-2xl mt-2 px-4 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t.comments}
              </Text>
              {currentProduct.$id && (
                <ChatD
                  chatId={currentProduct.$id}
                  creatorId={currentProduct.creator?.$id}
                />
              )}
            </View>
          </ScrollView>
        )}
        <BanModal
          isBanned={isBanned}
          reason={banReason}
          onRedirect={handleRedirect}
          language={language}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductDetails;
