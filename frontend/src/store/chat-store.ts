import { create } from "zustand";
import type { Message } from "../types/message-types";
import type { Chat } from "../types/chat-types";
import type { User } from "../types/user-types";
import { useAuthStore } from "./auth-store";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";
import { MESSAGE_MAX_LENGTH } from "../constants/chat";

type AckResponse<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; message: string };

interface UserAckPayload {
  user: User;
}

interface OnlineUser {
  id: number;
  username: string;
  role: "USER" | "ADMIN";
}

interface PresenceUpdatePayload {
  onlineUsers: OnlineUser[];
  onlineUserIds: number[];
}

interface ChatState {
  chats: Chat[];
  activeChatId: number | null;
  messagesByChatId: Record<number, Message[]>;
  joinedChatIds: number[];
  onlineUsers: OnlineUser[];
  onlineUserIds: number[];
  isConnected: boolean;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  mutingUserIds: number[];
  kickingUserIds: number[];
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
  kickUser: (userId: number) => Promise<void>;
  unkickUser: (userId: number) => Promise<void>;
  addMessage: (message: Message) => void;
  updateUserMuteState: (user: User) => void;
  updateUserKickState: (user: User) => void;
  setActiveChatId: (chatId: number | null) => void;
  //clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,
  messagesByChatId: {},
  joinedChatIds: [],
  onlineUsers: [],
  onlineUserIds: [],
  isConnected: false,
  isLoadingChats: false,
  isLoadingMessages: false,
  mutingUserIds: [],
  kickingUserIds: [],
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
    socket.off("presence:update");
    socket.off("user:muted");
    socket.off("user:unmuted");
    socket.off("user:kicked");
    socket.off("user:unkicked");

    socket.on("connect", () => {
      set({ isConnected: true, error: null });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false, onlineUsers: [], onlineUserIds: [] });
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

    socket.on(
      "presence:update",
      ({ onlineUsers, onlineUserIds }: PresenceUpdatePayload) => {
        set({ onlineUsers, onlineUserIds });
      },
    );

    socket.on("user:muted", ({ user }: UserAckPayload) => {
      get().updateUserMuteState(user);
    });

    socket.on("user:unmuted", ({ user }: UserAckPayload) => {
      get().updateUserMuteState(user);
    });

    socket.on("user:kicked", ({ user }: UserAckPayload) => {
      get().updateUserKickState(user);

      if (useAuthStore.getState().user?.id === user.id) {
        useAuthStore.getState().logout();
        get().disconnect();
      }
    });

    socket.on("user:unkicked", ({ user }: UserAckPayload) => {
      get().updateUserKickState(user);
    });
  },

  disconnect: () => {
    disconnectSocket();
    set({
      chats: [],
      activeChatId: null,
      messagesByChatId: {},
      joinedChatIds: [],
      onlineUsers: [],
      onlineUserIds: [],
      isConnected: false,
      isLoadingChats: false,
      isLoadingMessages: false,
      mutingUserIds: [],
      kickingUserIds: [],
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

    if (
      !socket ||
      !activeChatId ||
      !text.trim() ||
      text.length > MESSAGE_MAX_LENGTH
    ) {
      return;
    }

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

  kickUser: (userId: number) =>
    new Promise((resolve) => {
      const socket = getSocket();
      if (!socket) {
        set({ error: "Socket is not connected" });
        resolve();
        return;
      }

      set((state) => ({
        kickingUserIds: [...state.kickingUserIds, userId],
        error: null,
      }));

      socket.emit(
        "admin:user:kick",
        { userId },
        (response: AckResponse<UserAckPayload>) => {
          if (response.ok && response.data?.user) {
            get().updateUserKickState(response.data.user);
          } else if (!response.ok) {
            set({ error: response.message });
          }

          set((state) => ({
            kickingUserIds: state.kickingUserIds.filter((id) => id !== userId),
          }));
          resolve();
        },
      );
    }),

  unkickUser: (userId: number) =>
    new Promise((resolve) => {
      const socket = getSocket();
      if (!socket) {
        set({ error: "Socket is not connected" });
        resolve();
        return;
      }

      set((state) => ({
        kickingUserIds: [...state.kickingUserIds, userId],
        error: null,
      }));

      socket.emit(
        "admin:user:unkick",
        { userId },
        (response: AckResponse<UserAckPayload>) => {
          if (response.ok && response.data?.user) {
            get().updateUserKickState(response.data.user);
          } else if (!response.ok) {
            set({ error: response.message });
          }

          set((state) => ({
            kickingUserIds: state.kickingUserIds.filter((id) => id !== userId),
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

  updateUserKickState: (user) => {
    const currentUser = useAuthStore.getState().user;

    if (currentUser?.id === user.id) {
      useAuthStore.setState({
        user: {
          ...currentUser,
          isKicked: user.isKicked,
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
                    isKicked: user.isKicked,
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
            ? { ...participant, isKicked: user.isKicked }
            : participant,
        ),
        lastMessage:
          chat.lastMessage?.sender.id === user.id
            ? {
                ...chat.lastMessage,
                sender: {
                  ...chat.lastMessage.sender,
                  isKicked: user.isKicked,
                },
              }
            : chat.lastMessage,
      })),
    }));
  },
}));
