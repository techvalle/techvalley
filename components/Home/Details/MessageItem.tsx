// File: components/Product/MessageItem.tsx

import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { banUser, reportUser } from "@/lib/api";
import ReusableModalDP from "./ReusableModalDP";
import calculateTimeAgo from "@/components/Product/calculateTimeAgo";
import { useUserStore } from "@/store/userStore";
import { translationReort } from "@/constants/lang";

interface MessageItemProps {
  item: {
    $id: string;
    userId: string;
    avatarUrl: string | null;
    username: string;
    body: string;
    $createdAt: string;
  };
  user: any;
  onDelete: (messageId: string) => any;
  onOpenModal: (messageId: string | null) => void;
  isModalVisible: boolean;
  creatorId: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  item,
  user,
  onDelete,
  onOpenModal,
  isModalVisible,
  creatorId,
}) => {
  const lang: "ar" | "en" | "fr" = "ar"; // Replace with dynamic language selection
  const t = translationReort[lang];

  const { language, setLanguage } = useUserStore();

  const handleBanUser = async () => {
    try {
      const response = await banUser({
        userId: item.userId,
        reason: t.banReason,
        bannedBy: user?.$id as string,
      });
      console.log(response.message);
    } catch (error) {
      console.error("Failed to ban user:", error);
    }
  };

  const handleReportUser = async () => {
    try {
      const response = await reportUser({
        reporterId: user?.$id as string,
        reportedUserId: item.userId,
        reason: t.reportReason,
        details: t.reportDetails,
      });
      console.log(response.message);
    } catch (error) {
      console.error("Failed to submit report:", error);
    }
  };

  return (
    <View
      key={item.$id}
      className="flex-row-reverse py-4 items-center bg-white my-1 border-gray-300"
    >
      <ReusableModalDP
        isVisible={isModalVisible}
        onClose={() => onOpenModal(null)}
        currentUserId={user?.$id as string}
        productOwnerId={creatorId}
        language={language}
        messageOwnerId={item.userId}
        actions={[
          {
            key: "Delete",
            onPress: () => onDelete(item.$id),
            label: { ar: "حذف", en: "Delete", fr: "Supprimer" },
          },
          {
            key: "BanUser",
            onPress: handleBanUser,
            label: { ar: "حظر", en: "Ban User", fr: "Bannir l'utilisateur" },
          },
          {
            key: "Report",
            onPress: handleReportUser,
            label: { ar: "ابلاغ", en: "Report", fr: "Signaler" },
          },
        ]}
      />
      {user && (
        <TouchableOpacity
          onPress={() => onOpenModal(item.$id)}
          className="absolute top-4 left-0 z-10 p-1"
        >
          <MaterialIcons name="more-vert" size={18} color="black" />
        </TouchableOpacity>
      )}
      <Image
        source={{ uri: item.avatarUrl } as any}
        className="w-12 h-12 rounded-full mx-3 bg-black"
      />
      <View className="flex-1 bg-slate-40">
        <Text className="text-base font-bold text-right text-primary">
          {item.username}
        </Text>
        <Text className="text-black text-right text-[11px]">
          • {calculateTimeAgo(item.$createdAt, language)}
        </Text>
        <Text className="text-lg font-normal text-right">{item.body}</Text>
      </View>
    </View>
  );
};

export default MessageItem;
