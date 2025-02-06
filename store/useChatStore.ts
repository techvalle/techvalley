import { getUserAvatarAndName } from "@/lib/api";
import { appwriteConfig, databases } from "@/lib/config";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface ChatState {
  messages: any[];
  userDetailsCache: Record<string, any>;
  error: string | null;
  loading: boolean;
  getMessages: (
    chatId: string,
    limit?: number,
    offset?: number
  ) => Promise<void>;
  sendMessage: (
    chatId: string,
    userId: string,
    receiverId: string,
    body: string
  ) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  clearMessages: () => void;
}

const useChatStore = create<ChatState>(
  persist(
    (set, get) => ({
      messages: [],
      userDetailsCache: {},
      error: null,
      loading: false,

      getMessages: async (chatId, limit = 40, offset = 0) => {
        set({ loading: true, error: null });
        try {
          const { documents } = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.messageCol,
            [
              Query.orderAsc("$createdAt"),
              Query.equal("chatId", chatId),
              Query.limit(limit),
              Query.offset(offset),
            ]
          );

          const uniqueUserIds = [
            ...new Set(documents.map((msg) => msg.userId)),
          ];
          const userDetails = await Promise.all(
            uniqueUserIds.map((id) => getUserAvatarAndName(id))
          );
          const userDetailsCache = userDetails.reduce(
            (acc: any, details, index) => {
              acc[uniqueUserIds[index]] = details;
              return acc;
            },
            {}
          );

          set((state) => ({
            messages:
              offset === 0 ? documents : [...state.messages, ...documents],
            userDetailsCache: {
              ...state.userDetailsCache,
              ...userDetailsCache,
            },
          }));
        } catch (err: any) {
          set({ error: err.message });
          console.error("Error fetching messages:", err);
        } finally {
          set({ loading: false });
        }
      },

      sendMessage: async (chatId, userId, receiverId, body) => {
        try {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.messageCol,
            ID.unique(),
            { chatId, userId, receiverId, body },
            [Permission.write(Role.user(userId))]
          );
        } catch (err: any) {
          set({ error: err.message });
          console.error("Error sending message:", err);
        }
      },

      deleteMessage: async (messageId) => {
        try {
          await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.messageCol,
            messageId
          );
          set((state) => ({
            messages: state.messages.filter((msg) => msg.$id !== messageId),
          }));
        } catch (err: any) {
          set({ error: err.message });
          console.error("Error deleting message:", err);
        }
      },

      clearMessages: () => set({ messages: [], error: null }),
    }),
    {
      name: "chat-store", // Store name for persist
    } as PersistOptions<ChatState>
  ) as any
);

export default useChatStore;
