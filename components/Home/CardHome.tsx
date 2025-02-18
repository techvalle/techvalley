import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { icons } from "../../constants";
import { Query } from "react-native-appwrite";
import { useUserStore } from "@/store/userStore";
import { useProductStore } from "@/store/productStore";

import { appwriteConfig, databases } from "@/lib/config";
import { createChat } from "@/lib/api";
import { Product } from "@/types/appwriteTypes";
import Toast from "react-native-toast-message";
import { ImageAt } from "../ui/ImageAt";
import { translationCardHome } from "@/constants/lang";

interface CardHomeProps {
  item: Product; // Ideally replace with a proper `Product` type
  setPhone: (phone: string) => void;
  setModalVisible: (visible: boolean) => void;
  Ownerproduct: boolean;
  phone: string;
  views?: number;
}

const CardHome: React.FC<CardHomeProps> = ({
  item,
  Ownerproduct,
  setPhone,
  setModalVisible,
}) => {
  const router = useRouter();
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { user, language, setLanguage } = useUserStore();
  const setCurrentProduct = useProductStore((state) => state.setCurrentProduct);
  const { clearCurrentProduct } = useProductStore();

  const t = translationCardHome[language];

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "";
    if (price >= 1_000_000) {
      return `${(price / 1_000_000)?.toFixed(1)}M`;
    } else if (price >= 1_000) {
      return `${(price / 1_000)?.toFixed(1)}K`;
    }
    return price?.toString() ?? "";
  };

  const handleCreateChat = async () => {
    if (!item?.creator?.$id || item?.creator?.$id === user?.$id) {
      Toast.show({ type: "error", text1: t.chatError });
      return;
    }

    setLoadingChat(true);
    try {
      const existingChats = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.chatsCollectionId,
        [
          Query.or([
            Query.and([
              Query.equal("buyerId", user?.$id as any),
              Query.equal("productOwnerId", item?.creator?.$id),
            ]),
            Query.and([
              Query.equal("buyerId", item?.creator?.$id),
              Query.equal("productOwnerId", user?.$id as any),
            ]),
          ]),
        ]
      );

      if (existingChats.documents.length > 0) {
        const existingChat = existingChats.documents[0];
        router.push({
          pathname: `/screens/Chat/[roomId]`,
          params: {
            chadId: item.id as string,
            name: item.creator.name as string,
            avatar: item.creator.imageUrl as string,
            otherUserId: item.creator.$id as string,
          },
        } as any);
      } else {
        const newChat = await createChat(
          user?.$id as string,
          item?.creator?.$id,
          item?.$id,
          [user?.$id as string, item?.creator?.$id]
        );
        router.push({
          pathname: `/screens/Chat/[roomId]`,
          params: { chadId: item?.id, otherUserId: item?.creator?.$id },
        } as any);
      }
    } catch (error) {
      console.log("Error creating chat:", error);

      Toast.show({ type: "error", text1: t.chatCreationError });
    } finally {
      setLoadingChat(false);
    }
  };

  const handleCallPress = () => {
    if (!item?.creator?.phone) {
      Toast.show({ type: "error", text1: t.callError });
      return;
    }

    setPhone(item?.creator?.phone);
    setModalVisible(true);
  };

  const handleNavigateToDetails = async () => {
    if (!item) {
      Toast.show({ type: "error", text1: t.productDetailsError });
      return;
    }

    setLoadingDetails(true);
    try {
      clearCurrentProduct(); // Clear product when the component unmounts
      setCurrentProduct(item); // Save the product details to Zustand store
      router.push(`/screens/Home/details/[detailsId]`);
    } catch (error) {
      console.error("Error navigating to details:", error);
      Toast.show({ type: "error", text1: t.productDetailsError });
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <View className="p-1 mb-2">
      {loadingDetails ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <View style={{ marginBottom: 10 }} className="p-1">
          {loadingDetails ? (
            <ActivityIndicator size="large" color="#3498db" />
          ) : (
            <>
              <View style={{ marginBottom: 20 }} className="mr-3">
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginBottom: 2 }}
                  numberOfLines={1}
                  className={`text-primary font-sans-arabic-medium text-right ${
                    language === "ar" && "text-right"
                  }`}
                >
                  {item.Details.salesName}
                </Text>
                <Text
                  style={{ fontSize: 14, color: "black" }}
                  numberOfLines={1}
                  className={` ${language === "ar" && "text-right"}`}
                >
                  {item.Details.description}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleNavigateToDetails}
                disabled={loadingDetails}
              >
                <View
                  style={{
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                  }}
                  className="overflow-hidden"
                >
                  <ImageAt
                    className="ml-[1px]"
                    source={item.Details.mainPhoto}
                    style={{
                      width: "50%",
                      height: 150,
                      borderRadius: 3,
                      resizeMode: "cover",
                    }}
                  />
                  <View
                    style={{
                      width: "49.5%",
                      height: 150,
                      position: "relative",
                    }}
                  >
                    <ImageAt
                      source={item.Details.descriptionPhotos[0]}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 3,
                        resizeMode: "cover",
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "#FF6E4E",
                        borderRadius: 3,
                        opacity: 0.6,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {item.Details?.descriptionPhotos.length - 1}+
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <View
                className=""
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 13,
                  paddingRight: 8,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    className="bg-primary p-1 rounded-md mr-2"
                    style={{ maxWidth: 150, minWidth: 6 }} // Dynamic width
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "white",
                      }}
                      numberOfLines={1} // Single-line display
                      ellipsizeMode="tail" // Truncate if too long
                    >
                      <Text className="text-[10px] mx-3 text-white">XAF</Text>
                      {formatPrice(item.Details.price as any)}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={icons.anE}
                      className="w-4 h-4 mr-1"
                      resizeMode="contain"
                    />
                    <Text style={{ fontSize: 14, color: "gray" }}>
                      {item?.views?.viewers?.length ?? 0}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-center items-center ">
                  {!Ownerproduct && (
                    <TouchableOpacity
                      style={{ marginRight: 10 }}
                      onPress={() =>
                        Toast.show({ type: "error", text1: "share" })
                      }
                      className="flex flex-row justify-center items-center"
                    >
                      <Image
                        source={icons.shareH}
                        className="w-5 h-5 mr-1"
                        resizeMode="contain"
                      />
                      <Text
                        className={`${language === "ar" ? " text-right" : ""}`}
                      >
                        {t.share}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    className="flex flex-row justify-center items-center"
                    onPress={handleCreateChat}
                    disabled={loadingChat}
                  >
                    {loadingChat ? (
                      <ActivityIndicator size="small" color="#FF6E4E" />
                    ) : (
                      <>
                        <Image
                          source={icons.chatH}
                          className="w-4 h-4 mr-1"
                          resizeMode="contain"
                        />
                        <Text>{t.chat}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex flex-row justify-center items-center"
                    onPress={handleCallPress}
                  >
                    <Image
                      source={icons.callH}
                      className="w-4 h-4 mr-1"
                      resizeMode="contain"
                    />
                    <Text>{t.call}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default CardHome;
