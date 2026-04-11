import { create } from "zustand";
import type { Message } from "../types/message-types";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";

interface ChatState {
  roomId: string;
  messages: Message[];
  isConnected: boolean;

  connect: () => void;
  disconnect: () => void;
  joinRoom: (roomId: string) => void;
  sendMessage: (text: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  roomId: "general",
  messages: [],
  isConnected: false,

  connect: () => {
    const socket = connectSocket();

    socket.on("connect", () => {
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    socket.on("chat:message", (message: Message) => {
      get().addMessage(message);
    });
  },

  disconnect: () => {
    disconnectSocket();
    set({ isConnected: false, messages: [] });
  },

  joinRoom: (roomId: string) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("room:join", { roomId });
    set({ roomId, messages: [] });
  },

  sendMessage: (text: string) => {
    const socket = getSocket();
    const { roomId } = get();

    if (!socket || !text.trim()) return;

    socket.emit("chat:send", {
      roomId,
      text,
    });
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => set({ messages: [] }),
}));
