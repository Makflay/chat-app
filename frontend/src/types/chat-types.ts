import type { User } from "./user-types";
import type { Message } from "./message-types";

export type ChatType = "PRIVATE" | "GROUP" | "ASSISTANT";

export interface Chat {
  id: number;
  type: ChatType;
  title: string | null;
  isDefault: boolean;
  ownerUserId?: number | null;
  participants: User[];
  lastMessage: Message | null;
}
