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
import Delt from "./Delt";
import { useUserStore } from "@/store/userStore";
import { useEditStore } from "@/store/EditStore";
import { Product } from "@/types/appwriteTypes";

type UserTopProps = {
  timeAgo: string;
  city: string;
  productDetails: Record<string, any>;
  item: Product;
  onDelete: () => Promise<void>;
};

const UserTop: React.FC<UserTopProps> = ({
  timeAgo,
  city,
  productDetails,
  item,
  onDelete,
}) => {
  const { user, language, setLanguage } = useUserStore();
  const router = useRouter();

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setProductData, clearProductData } = useEditStore.getState(); // Directly access the Zustand store

  const handleEditPress = () => {
    clearProductData(); // Clear the product data before setting new data
    setProductData(item); // Save the product data in the store
    router.push(`/screens/Products/[edit]`);
  };
  const handleDeletePress = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await onDelete(); // Perform delete action
      setDeleteModalVisible(false); // Close the modal after successful deletion
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <View className="flex-row-reverse border-b-[1px] border-b-[#d3d0d0] py-3 mb-6">
        <View className="flex-row-reverse">
          <Image
            source={{ uri: user?.Details?.imageUrl || icons?.profile }}
            className="w-12 h-12 rounded-full ml-4"
            resizeMode="cover"
          />
          <View className="pt-1 justify-center items-end">
            <Text className="text-primary ml-4 font-sans-arabic-semibold">
              {user?.Details?.name}
            </Text>
            <View className="flex-row gap-x-2">
              <View className="flex-row-reverse justify-center items-center">
                <Image
                  source={icons?.datePP}
                  className="w-3 h-3 ml-1"
                  resizeMode="contain"
                />
                <Text style={{ fontSize: 10 }}>{timeAgo}</Text>
              </View>
              <View className="flex-row-reverse justify-center items-center">
                <Image
                  source={icons?.located}
                  className="w-3 h-3 ml-1"
                  resizeMode="contain"
                />
                <Text style={{ fontSize: 14 }}>{city}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-grow flex-row justify-start items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEditPress}
            className="flex justify-center items-center p-4 w-6 h-6 rounded-full bg-[#FFE5DF] ml-2"
          >
            <Image
              source={icons.pin}
              className="w-4 h-4"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDeletePress}
            className="flex justify-center items-center p-4 w-6 h-6 rounded-full bg-[#FFE5DF] ml-2"
          >
            {isDeleting ? (
              <ActivityIndicator color="#FF5C39" />
            ) : (
              <Image
                source={icons.bin}
                className="w-4 h-4"
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Delete Confirmation Modal */}
      <Delt
        isVisible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={handleDeleteConfirm}
        language={language} // Replace with "en" or "fr" for other languages
      />
    </>
  );
};

export default UserTop;
