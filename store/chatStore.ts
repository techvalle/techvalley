// stores/chatStore.ts

import { create } from "zustand";

interface ChatState {
  chatId: string | null;
  name: string | null;
  avatar: string | null;
  otherUserId: string | null;
  setChatData: (data: {
    chatId: string;
    name: string;
    avatar: string;
    otherUserId: string;
  }) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  name: null,
  avatar: null,
  otherUserId: null,
  setChatData: (data) =>
    set({
      chatId: data.chatId,
      name: data.name,
      avatar: data.avatar,
      otherUserId: data.otherUserId,
    }),
}));
