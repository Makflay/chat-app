import type { Chat } from "./chat.types";
export interface ClientToServerEvents {
  "chat:list": () => void;
  "chat:joinAll": () => void;
  "chat:open": (payload: { chatId: number }) => void;
  "chat-send": (payload: { chatId: number; text: string }) => void;
}

export interface ServerToClientEvents {
  "chat:list:success": (payload: { chats: Chat[] }) => void;
  "chat:joinAll:success": (payload: { chatIds: number[] }) => void;
  "chat:open:success": (payload: { chatId: number }) => void;

  //"chat:error": (payload: {message: string}) => void;
}

export interface InterServerEvents {}
export interface SocketData {
  userId: number;
  role: "USER" | "ADMIN";
  email: string;
}
