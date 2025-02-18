import { icons } from "@/constants";
import { appwriteConfig, databases } from "@/lib/config";
import { useUserStore } from "@/store/userStore";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ID, Query } from "react-native-appwrite";

type TopLikesProps = {
  timeAgo: string;
  city: string;
  item: any;
  userId: string;
};

const TopLikes: React.FC<TopLikesProps> = ({ timeAgo, city, item, userId }) => {
  const { language } = useUserStore();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const translations = {
    ar: {
      unknownUser: "مستخدم غير معروف",
      errorTitle: "خطأ",
      likeError: "فشل في تحديث الإعجاب. يرجى المحاولة مرة أخرى.",
      invalidUserOrProduct: "بيانات غير صالحة.",
    },
    en: {
      unknownUser: "Unknown User",
      errorTitle: "Error",
      likeError: "Failed to update like status. Please try again.",
      invalidUserOrProduct: "Invalid product or user information.",
    },
    fr: {
      unknownUser: "Utilisateur inconnu",
      errorTitle: "Erreur",
      likeError:
        "Échec de la mise à jour du statut J'aime. Veuillez réessayer.",
      invalidUserOrProduct:
        "Informations sur le produit ou l'utilisateur non valides.",
    },
  };

  const t = translations[language]; // Use the current language for translations

  const creatorDetails = item?.creator?.Details
    ? JSON.parse(item.creator.Details[0])
    : null;

  const productId = item?.$id;

  const fetchLikeStatus = async () => {
    if (!productId || !userId) {
      console.warn(t.invalidUserOrProduct);
      setIsLiked(false);
      return;
    }

    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.likesCollectionId,
        [Query.equal("productId", productId), Query.equal("userId", userId)]
      );
      setIsLiked(response.documents.length > 0);
    } catch (error) {
      console.error("Error fetching like status:", error);
      setIsLiked(false);
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [productId, userId]);

  const handleLikeToggle = async () => {
    if (!productId || !userId) {
      Alert.alert(t.errorTitle, t.invalidUserOrProduct);
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (isLiked) {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.likesCollectionId,
          [Query.equal("productId", productId), Query.equal("userId", userId)]
        );
        if (response.documents.length > 0) {
          const likeId = response.documents[0].$id;
          await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.likesCollectionId,
            likeId
          );
        }
      } else {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.likesCollectionId,
          ID.unique(),
          { productId, userId }
        );
      }
      setIsLiked(!isLiked);
    } catch (error) {
      Alert.alert(t.errorTitle, t.likeError);
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-row-reverse border-b-[1px] border-b-[#cfcfcf] py-3 px-1 mb-4">
      <View className="flex-row-reverse items-center">
        {creatorDetails?.imageUrl && (
          <Image
            source={{
              uri: creatorDetails?.imageUrl || icons?.eye,
            }}
            className="w-12 h-12 rounded-full ml-4"
            resizeMode="cover"
          />
        )}
        {!creatorDetails?.imageUrl && (
          <Image
            source={icons?.unUser}
            className="w-12 h-12 rounded-full ml-4"
            resizeMode="cover"
          />
        )}
        <View className="pt-1 justify-center items-end">
          <Text className="text-primary ml-4 font-sans-arabic-semibold text-[17px] mb-1">
            {creatorDetails?.name || t.unknownUser}
          </Text>
          <View className="flex-row gap-x-2">
            <View className="flex-row-reverse justify-center items-center">
              <Image
                source={icons.datePP}
                className="w-3 h-3 ml-1"
                resizeMode="contain"
              />
              <Text style={{ fontSize: 8 }}>{timeAgo}</Text>
            </View>
            <View className="flex-row-reverse justify-center items-center">
              <Image
                source={icons.located}
                className="w-3 h-3 ml-1"
                resizeMode="contain"
              />
              <Text style={{ fontSize: 10 }}>{city}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex-grow flex-row justify-start items-center">
        <TouchableOpacity
          activeOpacity={0.5}
          className={`flex justify-center items-center p-4 w-6 h-6 rounded-full ${
            isLiked ? "bg-[#FFCCCC]" : "bg-[#FFE5DF]"
          } ml-2`}
          onPress={handleLikeToggle}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FF6E4E" />
          ) : (
            <Image
              source={isLiked ? icons.heartFill : icons.heart}
              className="w-4 h-4"
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopLikes;
