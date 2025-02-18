import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { icons } from "../../constants";
import { Query, ID } from "react-native-appwrite";
import { Creator } from "@/types/appwriteTypes";
import { appwriteConfig, databases } from "@/lib/config";

interface UserTopHomeProps {
  timeAgo: string;
  city: string;
  item: {
    creator: Creator | null; // Using the Creator type
    $id: string; // Product ID
  };
  userId: string; // Current logged-in user ID
}

const UserTopHome: React.FC<UserTopHomeProps> = ({
  timeAgo,
  city,
  item,
  userId,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial like state
  const fetchLikeStatus = async () => {
    if (!item?.$id || !userId) {
      console.warn("Invalid productId or userId for fetchLikeStatus");
      setIsLiked(false);
      return;
    }

    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.likesCollectionId,
        [Query.equal("productId", item.$id), Query.equal("userId", userId)]
      );

      setIsLiked(response.documents.length > 0);
    } catch (error) {
      console.error("Error fetching like status:", error);
      setIsLiked(false);
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [item?.$id, userId]);

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!item?.$id || !userId) {
      Alert.alert("Error", "Invalid product or user information.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (isLiked) {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.likesCollectionId,
          [Query.equal("productId", item.$id), Query.equal("userId", userId)]
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
          { productId: item.$id, userId }
        );
      }

      setIsLiked(!isLiked);
    } catch (error) {
      Alert.alert("Error", "Failed to update like status. Please try again.");
      console.error("Error toggling like status:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderButton = () => {
    if (item?.creator?.$id && userId === item.creator.$id) {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          disabled={loading}
          className="flex justify-center items-center p-4 w-6 h-6 rounded-full bg-[#FFE5DF] ml-2"
          onPress={() =>
            Alert.alert("Share", "Share functionality to be implemented.")
          }
        >
          <Image
            source={icons.shareH}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          className={`flex justify-center items-center p-4 w-6 h-6 rounded-full ${
            isLiked ? "bg-[#FFCCCC]" : "bg-[#FFE5DF]"
          } ml-2`}
          onPress={handleLikeToggle}
          disabled={loading}
        >
          <Image
            source={isLiked ? icons.heartFill : icons.heart}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View className="flex-row-reverse border-b-[1px] border-b-[#cfcfcf] py-3 px-1 mb-4">
      <View className="flex-row-reverse items-center">
        {item?.creator?.Details?.imageUrl ? (
          <Image
            source={{ uri: item?.creator?.Details?.imageUrl }}
            className="w-12 h-12 rounded-full ml-4"
            resizeMode="cover"
          />
        ) : (
          <Image
            source={icons.unUser}
            className="w-12 h-12 rounded-full ml-4"
            resizeMode="cover"
          />
        )}

        <View className="pt-1 justify-center items-end">
          <Text className="text-primary ml-4 font-sans-arabic-semibold text-[17px] mb-1">
            {item?.creator?.Details?.name || "Unknown User"}
          </Text>
          <View className="flex-row gap-x-2">
            <View className="flex-row-reverse justify-center items-center">
              <Image
                source={icons.datePP}
                className="w-3 h-3 ml-1"
                resizeMode="contain"
              />
              <Text style={{ fontSize: 11 }}>{timeAgo}</Text>
            </View>
            <View className="flex-row-reverse justify-center items-center">
              <Image
                source={icons.located}
                className="w-3 h-3 ml-1"
                resizeMode="contain"
              />
              <Text style={{ fontSize: 13 }}>{city}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex-grow flex-row justify-start items-center">
        {renderButton()}
      </View>
    </View>
  );
};

export default UserTopHome;
