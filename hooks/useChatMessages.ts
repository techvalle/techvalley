import { appwriteConfig, client, databases } from "@/lib/config";
import { useUserGetStore } from "@/store/useUserGetStore";
import { useState, useEffect, useCallback } from "react";
import { ID, Permission, Query, Role } from "react-native-appwrite";

const DEFAULT_AVATAR_URL = null;
const DEFAULT_USERNAME = "User";

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

interface UseChatMessagesProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  handleSubmit: (data: {
    messageBody: string;
    creatorId: string;
  }) => Promise<void>;
  getMessages: (limit?: number, offset?: number) => Promise<void>;
  error: Error | null;
}

const useChatMessages = (
  chatId: string,
  user: { $id: string } | null
): UseChatMessagesProps => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { userCache, fetchUserDetails } = useUserGetStore();

  const fetchAndDisplayUsers = useCallback(
    async (userIds: string[]) => {
      const newUserIds = userIds.filter((id) => !userCache[id]); // Check cache
      if (newUserIds?.length > 0) {
        await fetchUserDetails(newUserIds); // Fetch missing user details
      }
    },
    [userCache, fetchUserDetails]
  );
  const formatMessage = useCallback(
    (msg: Message): Message => {
      const user = userCache[msg.userId];
      return {
        ...msg,
        avatarUrl: user?.avatarUrl ?? DEFAULT_AVATAR_URL,
        username: user?.username ?? DEFAULT_USERNAME,
      };
    },
    [userCache]
  );

  const getMessages = useCallback(
    async (limit = 40, offset = 0) => {
      try {
        const { documents } = await databases.listDocuments<any>(
          appwriteConfig.databaseId,
          appwriteConfig.messageCol,
          [
            Query.orderAsc("$createdAt"),
            Query.equal("chatId", chatId),
            Query.limit(limit),
            Query.offset(offset),
          ]
        );

        if (documents?.length > 0) {
          const uniqueUserIds = Array.from(
            new Set(documents.map((msg) => msg.userId))
          );

          // Fetch user details for unique userIds
          await fetchAndDisplayUsers(uniqueUserIds);

          setMessages((prev) =>
            offset === 0
              ? documents.map(formatMessage)
              : [...prev, ...documents.map(formatMessage)]
          );
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err as Error);
      }
    },
    [chatId, fetchAndDisplayUsers, formatMessage]
  );

  useEffect(() => {
    getMessages();

    const subscription = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messageCol}.documents`,
      (response: any) => {
        if (response.events.some((e: string) => e.includes("create"))) {
          setMessages((prev) => [
            ...prev,
            formatMessage(response.payload as Message),
          ]);
        } else if (response.events.some((e: string) => e.includes("delete"))) {
          setMessages((prev) =>
            prev.filter((msg) => msg.$id !== (response.payload as Message).$id)
          );
        }
      }
    );

    return () => {
      try {
        subscription();
      } catch (err) {
        console.error("Error unsubscribing:", err);
      }
    };
  }, [getMessages, formatMessage]);

  const handleSubmit = async ({
    messageBody,
    creatorId,
  }: {
    messageBody: string;
    creatorId: string;
  }) => {
    if (!messageBody.trim()) return;

    try {
      let receiverId = user?.$id === creatorId ? "" : creatorId;
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.messageCol,
        ID.unique(),
        {
          userId: user?.$id,
          chatId,
          receiverId,
          body: messageBody,
        },
        [Permission.write(Role.user(user?.$id || ""))]
      );
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err as Error);
    }
  };

  return {
    messages,
    setMessages,
    handleSubmit,
    getMessages,
    error,
  };
};

export default useChatMessages;
