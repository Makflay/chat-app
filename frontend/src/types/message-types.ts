import type { User } from "./user-types";

export interface Message {
  id: number;
  content: string;
  senderId: number;
  chatId: number;
  createdAt: string;
  user: User;
}
