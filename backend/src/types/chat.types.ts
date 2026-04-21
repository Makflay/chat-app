import { ChatType } from "../generated/prisma";

export interface Chat {
  id: number;
  type: ChatType;
  title: string | null;
  systemKey: string | null;
  isDefault: boolean;
  ownerUserId: number | null;
}
