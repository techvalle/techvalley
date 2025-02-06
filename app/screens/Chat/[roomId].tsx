import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { appwriteConfig, client, databases } from "@/lib/config";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import Backbottun from "@/components/ui/Backbottun";
import UserTopChat from "@/components/Chat/UserTopChat";
import { icons } from "@/constants";
import { translationCahtRoom } from "@/constants/lang";
import FormatTime from "@/components/Chat/FormatTime";
import { Message } from "@/types/appwriteTypes";

const ChatPage = () => {
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const { user, language } = useUserStore();
  const { chatId, name, avatar, otherUserId } = useChatStore();
  const [isSending, setIsSending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const t = translationCahtRoom[language];

  // Fetch messages
  const getMessages = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.messageCol,
        [
          Query.orderDesc("$createdAt"),
          Query.equal("chatId", chatId || ""),
          Query.search("visibility", user?.$id || ""),
        ]
      );

      setMessages(response?.documents as any);
    } catch (error) {
      console.error(t.errorFetching, error);
    }
  };

  const handleLongPress = () => setShowDelete(true);

  useEffect(() => {
    getMessages();
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messageCol}.documents`,
      (response: any) => {
        const { events, payload } = response;
        if (events.includes("databases.*.collections.*.documents.*.delete")) {
          setMessages((prevState) =>
            prevState.filter((message: Message) => message?.$id !== payload.$id)
          );
        }
        if (events.includes("databases.*.collections.*.documents.*.create")) {
          if (payload.chatId === chatId) {
            setMessages((prevState) => [payload, ...prevState] as any);
          }
        }
      }
    );
    return () => unsubscribe();
  }, [chatId]);

  // Handle message sending
  const handleSend = async () => {
    if (messageBody.trim() === "") return;

    const payload = {
      userId: user?.$id,
      body: messageBody,
      chatId: chatId,
      receiverId: otherUserId,
      visibility: [user?.$id, otherUserId],
    };

    setIsSending(true);

    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.messageCol,
        ID.unique(),
        payload,
        [Permission.write(Role.user(user?.$id || ""))]
      );
      setMessageBody("");
    } catch (error) {
      console.error(t.errorSending, error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle message deletion
  const deleteMessage = async (messageId: string, userId: string) => {
    try {
      const message = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.messageCol,
        messageId
      );

      const updatedVisibility = message.visibility.filter(
        (id: string) => id !== userId
      );

      if (updatedVisibility.length === 0) {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.messageCol,
          messageId
        );
      } else {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.messageCol,
          messageId,
          { visibility: updatedVisibility }
        );
      }

      setMessages((prevState) =>
        prevState.filter((message: Message) => message?.$id !== messageId)
      );
      setShowDelete(false);
    } catch (error) {
      console.error(t.errorDeleting, error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (!item) return null;

    const isOwner = item?.userId === user?.$id;

    return (
      <TouchableOpacity
        onLongPress={handleLongPress}
        activeOpacity={0.8}
        className={`mb-2 p-3 rounded-lg w-[70%] max-w-[80%] ${
          isOwner
            ? "bg-primary self-start rounded-tl-lg rounded-br-lg rounded-bl-none"
            : "bg-[#DFDFDF] self-end rounded-tr-lg rounded-bl-lg rounded-br-none"
        }`}
      >
        <Text
          className={isOwner ? "text-white font-bold mb-2" : "text-black mb-2"}
        >
          {item.body}
        </Text>

        <View
          className={`flex-row items-center justify-between ${
            isOwner ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Text
            className={
              isOwner
                ? "text-white font-bold text-xs"
                : "text-black text-xs font-light"
            }
          >
            {FormatTime(item?.$createdAt, language)}
          </Text>
          {isOwner && showDelete && (
            <TouchableOpacity
              onPress={() => deleteMessage(item.$id, user?.$id)}
            >
              <Text className="text-red-500 text-xs">{t.delete}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 pb-4 bg-white">
      <KeyboardAvoidingView
        className="flex-1 p-5 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Backbottun />
            <UserTopChat
              avatar={avatar}
              name={name}
              otherUserId={otherUserId}
            />
            <FlatList
              className="mb-3"
              data={messages}
              renderItem={renderMessage}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item?.$id}
              inverted
            />
            <View className="flex-row mt-5 items-center ">
              <TextInput
                value={messageBody}
                onChangeText={setMessageBody}
                placeholder={t.typeMessage}
                className="flex-1 border border-gray-300 p-3 rounded-lg mr-2"
                multiline={true}
                textAlignVertical="top"
              />
              <TouchableOpacity
                onPress={handleSend}
                activeOpacity={0.4}
                disabled={isSending}
              >
                <View className="p-2 ustify-center items-center bg-black rounded-full">
                  <Image
                    source={icons?.send}
                    className="w-8 h-8 m-auto"
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;
