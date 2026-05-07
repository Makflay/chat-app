import { create } from "zustand";
import type { Message } from "../types/message-types";
import type { Chat } from "../types/chat-types";
import type { User } from "../types/user-types";
import { useAuthStore } from "./auth-store";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";

type AckResponse<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; message: string };

interface UserAckPayload {
  user: User;
}

interface ChatState {
  chats: Chat[];
  activeChatId: number | null;
  messagesByChatId: Record<number, Message[]>;
  joinedChatIds: number[];
  isConnected: boolean;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  mutingUserIds: number[];
  error: string | null;

  connect: () => void;
  disconnect: () => void;

  requestChats: () => void;
  //joinRoom: (roomId: string) => void;
  joinAllChats: () => void;
  openChat: (chatId: number) => void;
  sendMessage: (text: string) => void;
  muteUser: (userId: number) => Promise<void>;
  unmuteUser: (userId: number) => Promise<void>;
  addMessage: (message: Message) => void;
  updateUserMuteState: (user: User) => void;
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
  mutingUserIds: [],
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
    socket.off("user:muted");
    socket.off("user:unmuted");

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

    socket.on("user:muted", ({ user }: UserAckPayload) => {
      get().updateUserMuteState(user);
    });

    socket.on("user:unmuted", ({ user }: UserAckPayload) => {
      get().updateUserMuteState(user);
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
      mutingUserIds: [],
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

  muteUser: (userId: number) =>
    new Promise((resolve) => {
      const socket = getSocket();
      if (!socket) {
        set({ error: "Socket is not connected" });
        resolve();
        return;
      }

      set((state) => ({
        mutingUserIds: [...state.mutingUserIds, userId],
        error: null,
      }));

      socket.emit(
        "admin:user:mute",
        { userId },
        (response: AckResponse<UserAckPayload>) => {
          if (response.ok && response.data?.user) {
            get().updateUserMuteState(response.data.user);
          } else if (!response.ok) {
            set({ error: response.message });
          }

          set((state) => ({
            mutingUserIds: state.mutingUserIds.filter((id) => id !== userId),
          }));
          resolve();
        },
      );
    }),

  unmuteUser: (userId: number) =>
    new Promise((resolve) => {
      const socket = getSocket();
      if (!socket) {
        set({ error: "Socket is not connected" });
        resolve();
        return;
      }

      set((state) => ({
        mutingUserIds: [...state.mutingUserIds, userId],
        error: null,
      }));

      socket.emit(
        "admin:user:unmute",
        { userId },
        (response: AckResponse<UserAckPayload>) => {
          if (response.ok && response.data?.user) {
            get().updateUserMuteState(response.data.user);
          } else if (!response.ok) {
            set({ error: response.message });
          }

          set((state) => ({
            mutingUserIds: state.mutingUserIds.filter((id) => id !== userId),
          }));
          resolve();
        },
      );
    }),

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

  updateUserMuteState: (user) => {
    const currentUser = useAuthStore.getState().user;

    if (currentUser?.id === user.id) {
      useAuthStore.setState({
        user: {
          ...currentUser,
          isMuted: user.isMuted,
        },
      });
    }

    set((state) => ({
      messagesByChatId: Object.fromEntries(
        Object.entries(state.messagesByChatId).map(([chatId, messages]) => [
          chatId,
          messages.map((message) =>
            message.sender.id === user.id
              ? {
                  ...message,
                  sender: {
                    ...message.sender,
                    isMuted: user.isMuted,
                  },
                }
              : message,
          ),
        ]),
      ),
      chats: state.chats.map((chat) => ({
        ...chat,
        participants: chat.participants.map((participant) =>
          participant.id === user.id
            ? { ...participant, isMuted: user.isMuted }
            : participant,
        ),
        lastMessage:
          chat.lastMessage?.sender.id === user.id
            ? {
                ...chat.lastMessage,
                sender: {
                  ...chat.lastMessage.sender,
                  isMuted: user.isMuted,
                },
              }
            : chat.lastMessage,
      })),
    }));
  },
}));
