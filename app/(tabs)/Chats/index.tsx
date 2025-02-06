import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/userStore";
import {
  deleteAllMessagesByChatId,
  fetchUserChats,
  getUserAvatarAndName,
} from "@/lib/api";
import { formatTimeAgoLocalized } from "@/constants";
import NavTop from "@/components/Product/NavTop";
import NotfoundPage from "@/components/ui/NotfoundPage";
import { useChatStore } from "@/store/chatStore";

// Type definitions
interface Chat {
  id: string;
  otherUserId: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
}

const translations = {
  ar: {
    myChats: "دردشاتي",
    options: "خيارات",
    delete: "حذف",
    keep: "احتفظ",
    noChats: "ليس لديك دردشات",
    errorFetchingChats: "حدث خطأ أثناء جلب الدردشات.",
    errorNavigating: "حدث خطأ أثناء التنقل إلى الدردشة.",
    confirmDelete: "ماذا تريد أن تفعل مع دردشة",
  },
  en: {
    myChats: "My Chats",
    options: "Options",
    delete: "Delete",
    keep: "Keep",
    noChats: "You have no chats",
    errorFetchingChats: "An error occurred while fetching chats.",
    errorNavigating: "An error occurred while navigating to the chat.",
    confirmDelete: "What do you want to do with the chat",
  },
  fr: {
    myChats: "Mes Discussions",
    options: "Options",
    delete: "Supprimer",
    keep: "Garder",
    noChats: "Vous n'avez pas de discussions",
    errorFetchingChats:
      "Une erreur s'est produite lors de la récupération des discussions.",
    errorNavigating:
      "Une erreur s'est produite lors de la navigation vers la discussion.",
    confirmDelete: "Que voulez-vous faire avec la discussion",
  },
};

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user, language } = useUserStore();

  const t = translations[language || "ar"]; // Use the selected language

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!user || !user.$id) {
          console.error("User is null or undefined");
          return;
        }

        const userChats = await fetchUserChats(user.$id);
        const formattedChats = await Promise.all(
          userChats.map(async (chat) => {
            let otherUserId =
              chat.buyerId === user.$id ? chat.productOwnerId : chat.buyerId;

            const otherUserDetails = await getUserAvatarAndName(otherUserId);
            const { userName: name, avatarUrl: avatar } = otherUserDetails;

            return {
              id: chat.$id,
              otherUserId,
              name,
              message: "New message",
              time: chat.updatedAt || chat.$createdAt,
              avatar,
            };
          })
        );

        setChats(formattedChats.filter(Boolean));
      } catch (error) {
        console.error(t.errorFetchingChats, error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user?.$id]);

  const handleMenuPress = (item: Chat) => {
    Alert.alert(
      t.options,
      `${t.confirmDelete} ${item.name}?`,
      [
        { text: t.delete, onPress: () => handleDeleteAllMessages(item.id) },
        { text: t.keep, style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAllMessages = async (chatId: string) => {
    try {
      await deleteAllMessagesByChatId(chatId, user?.$id as string);
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
    } catch (error) {
      console.error(t.errorFetchingChats, error);
    }
  };

  const handleChatPress = (item: Chat) => {
    try {
      // Update the Zustand store with the selected chat data
      const { setChatData } = useChatStore.getState();
      setChatData({
        chatId: item.id,
        name: item.name,
        avatar: item.avatar,
        otherUserId: item.otherUserId,
      });

      // Navigate to the chat room
      router.push(`/screens/Chat/[roomId]`);
    } catch (error) {
      console.error(t.errorNavigating, error);
    }
  };
  const renderItem = ({ item }: { item: Chat }) => (
    <View className="flex-row-reverse p-4 items-center border-b border-gray-300">
      <TouchableOpacity
        onPress={() => handleMenuPress(item)}
        className="absolute top-4 left-4 z-10"
      >
        <MaterialIcons name="more-vert" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={{ uri: item.avatar }}
        className="w-12 h-12 rounded-full mx-3"
      />
      <View className="flex-1">
        <TouchableOpacity onPress={() => handleChatPress(item)}>
          <Text className="text-lg font-bold text-right">{item.name}</Text>
          <Text className="text-gray-600 text-right">
            {item.message} • {formatTimeAgoLocalized(item.time, language)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponentStyle={{ paddingHorizontal: 20, paddingTop: 7 }}
        data={chats}
        ListHeaderComponent={() => (
          <NavTop logo title={t.myChats} containerS="w-14 h-14" />
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="bg-white"
        ListEmptyComponent={() => <NotfoundPage text={t.noChats} />}
        refreshing={loading}
      />
    </SafeAreaView>
  );
};

export default Chats;
