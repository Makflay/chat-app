import { create } from "zustand";
import type { Message } from "../types/message-types";
import type { Chat } from "../types/chat-types";
import { useAuthStore } from "./auth-store";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";

interface ChatState {
  chats: Chat[];
  activeChatId: number | null;
  messagesByChatId: Record<number, Message[]>;
  joinedChatIds: number[];
  isConnected: boolean;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  error: string | null;

  connect: () => void;
  disconnect: () => void;

  requestChats: () => void;
  //joinRoom: (roomId: string) => void;
  joinAllChats: () => void;
  openChat: (chatId: number) => void;
  sendMessage: (text: string) => void;
  addMessage: (message: Message) => void;
  setActiveChatId: (chatId: number | null) => void;
  //clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,
  messagesByChatId: {},
  joinedChatIds: [],
  isConnected: false,
  isLoadingChats: false,
  isLoadingMessages: false,
  error: null,

  connect: () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    const socket = connectSocket(token);

    socket.off("connect");
    socket.off("disconnect");
    socket.off("chat:list:success");
    socket.off("chat:joinAll:success");
    socket.off("chat:open:success");
    socket.off("chat:message:new");
    socket.off("chat:error");

    socket.on("connect", () => {
      set({ isConnected: true, error: null });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    socket.on("chat:list:success", ({ chats }: { chats: Chat[] }) => {
      set({
        chats,
        isLoadingChats: false,
      });
    });

    socket.on("chat:joinAll:success", ({ chatIds }: { chatIds: number[] }) => {
      set({
        joinedChatIds: chatIds,
      });
    });

    socket.on(
      "chat:open:success",
      ({ chatId, messages }: { chatId: number; messages: Message[] }) => {
        set((state) => ({
          activeChatId: chatId,
          isLoadingMessages: false,
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: messages,
          },
        }));
      },
    );

    socket.on("chat:message:new", (message: Message) => {
      get().addMessage(message);
    });

    socket.on("chat:error", ({ message }: { message: string }) => {
      set({
        error: message,
        isLoadingChats: false,
        isLoadingMessages: false,
      });
    });
  },

  disconnect: () => {
    disconnectSocket();
    set({
      chats: [],
      activeChatId: null,
      messagesByChatId: {},
      joinedChatIds: [],
      isConnected: false,
      isLoadingChats: false,
      isLoadingMessages: false,
      error: null,
    });
  },

  requestChats: () => {
    const socket = getSocket();
    if (!socket) return;

    set({
      isLoadingChats: true,
      error: null,
    });
    socket.emit("chat:list");
  },

  joinAllChats: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("chat:joinAll");
  },

  openChat: (chatId: number) => {
    const socket = getSocket();
    if (!socket) return;

    set({
      isLoadingMessages: true,
      error: null,
    });

    socket.emit("chat:open", { chatId });
  },

  sendMessage: (text: string) => {
    const socket = getSocket();
    const { activeChatId } = get();

    if (!socket || !activeChatId || !text.trim()) return;

    socket.emit("chat:send", {
      chatId: activeChatId,
      text,
    });
  },

  setActiveChatId: (chatId) => {
    set({ activeChatId: chatId });
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messagesByChatId: {
        ...state.messagesByChatId,
        [message.chatId]: [
          ...(state.messagesByChatId[message.chatId] || []),
          message,
        ],
      },
      chats: state.chats.map((chat) =>
        chat.id === message.chatId
          ? {
              ...chat,
              lastMessage: message,
            }
          : chat,
      ),
    }));
  },
}));
