import { ChatType } from "../generated/prisma";

export interface Chat {
  id: number;
  type: ChatType;
  title: string | null;
  systemKey: string | null;
  isDefault: boolean;
  ownerUserId: number | null;
}

export interface MessageSender {
  id: number;
  username: string;
  email: string;
  isBot: boolean;
  isMuted: boolean;
  isKicked: boolean;
}

export interface ChatMessage {
  id: number;
  content: string | null;
  senderId: number;
  chatId: number;
  createdAt: Date;
  updatedAt: Date;
  sender: MessageSender;
}

export interface chatParticipantPreview {
  id: number;
  username: string;
  isBot: boolean;
  isMuted: boolean;
  isKicked: boolean;
}

export interface LastMessagePreview {
  id: number;
  content: string | null;
  createdAt: Date;
  sender: {
    id: number;
    username: string;
    isBot: boolean;
    isMuted: boolean;
    isKicked: boolean;
  };
}

export interface UserChat {
  id: number;
  type: ChatType;
  title: string | null;
  systemKey: string | null;
  isDefault: boolean;
  ownerUserId: number | null;
  participants: chatParticipantPreview[];
  lastMessage: LastMessagePreview | null;
}
