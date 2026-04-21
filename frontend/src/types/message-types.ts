//import type { User } from "./user-types";

export interface MessageSender {
  id: number;
  username: string;
  email?: string;
  isBot?: boolean;
}
export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  sender: MessageSender;
}
