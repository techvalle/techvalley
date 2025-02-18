// File: components/Chat/ChatD.tsx

import useChatMessages from "@/hooks/useChatMessages";
import { appwriteConfig, databases } from "@/lib/config";
import { useUserStore } from "@/store/userStore";
import React, { useState, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";

interface Message {
  $id: string;
  userId: string;
  chatId: string;
  receiverId?: string;
  body: string;
  $createdAt: string;
  avatarUrl?: string | null;
  username?: string;
}

interface ChatDProps {
  chatId: string;
  creatorId: string;
}

const translations = {
  ar: {
    loading: "جاري التحميل...",
    error: "حدث خطأ: ",
  },
  en: {
    loading: "Loading...",
    error: "An error occurred: ",
  },
  fr: {
    loading: "Chargement...",
    error: "Une erreur s'est produite: ",
  },
};

const ChatD: React.FC<ChatDProps> = ({ chatId, creatorId }) => {
  const [messageBody, setMessageBody] = useState<string>("");
  const { user, language } = useUserStore();

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  let loading = false;

  const {
    messages = [],
    handleSubmit,
    getMessages,
    setMessages,
    error,
  } = useChatMessages(chatId, user); // Default `messages` to empty array

  const t = translations[language as keyof typeof translations];

  const onOpenModal = (messageId: string | null) =>
    setSelectedMessageId(messageId);

  const handleDelete = useCallback(
    async (messageId: string) => {
      try {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.messageCol,
          messageId
        );
        setMessages((prev = []) =>
          prev.filter((message) => message.$id !== messageId)
        );
        setSelectedMessageId(null);
      } catch (error) {
        console.error("Error deleting message", error);
      }
    },
    [setMessages]
  );

  const handleSend = async () => {
    if (messageBody.trim()) {
      setIsLoading(true); // Start loading
      try {
        await handleSubmit({ messageBody, creatorId });
        setMessageBody("");

        const newMessages: any = await getMessages();
        if (newMessages as any) setMessages(newMessages); // Update messages if `newMessages` exists
      } catch (error) {
        console.error("Error updating messages after sending", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const refreshedMessages: any = await getMessages();
      setMessages(refreshedMessages);
    } catch (error) {
      console.error("Error refreshing messages", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{t.loading}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <Text style={{ color: "red" }}>
        {t.error} {error.message}
      </Text>
    );
  }

  return (
    <View className="p-4 flex-1 relative">
      {messages.map((item: any) => (
        <MessageItem
          key={item.$id}
          item={item}
          user={user}
          creatorId={creatorId}
          isModalVisible={selectedMessageId === item.$id}
          onOpenModal={onOpenModal}
          onDelete={handleDelete}
        />
      ))}
      {user && (
        <MessageInput
          messageBody={messageBody}
          setMessageBody={setMessageBody}
          onSubmit={handleSend}
          isLoading={isLoading}
          language={language}
        />
      )}
    </View>
  );
};

export default ChatD;
