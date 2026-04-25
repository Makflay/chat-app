import { prisma } from "../../config/db";
import { ChatType, Role } from "../../generated/prisma";
import "../../config/env";
import type { Chat } from "../../types/chat.types";

export const ensureGroupChat = async (): Promise<Chat> => {
  try {
    const SYSTEM_GROUP_KEY = process.env.SYSTEM_GROUP_KEY;

    if (!SYSTEM_GROUP_KEY) {
      throw new Error("Global chat credetinals are not set in .env");
    }

    const exiting = await prisma.chat.findUnique({
      where: { systemKey: SYSTEM_GROUP_KEY },
    });

    if (exiting) {
      return exiting;
    }

    const groupChat = await prisma.chat.create({
      data: {
        type: ChatType.GROUP,
        title: "Group room",
        systemKey: SYSTEM_GROUP_KEY,
        isDefault: true,
      },
    });

    return groupChat;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating group chat: ${error}`);
    } else {
      throw new Error("Creating group chat room unknown error");
    }
  }
};

export const attachUserToGroupChat = async (userId: number): Promise<Chat> => {
  const groupChat = await ensureGroupChat();

  await prisma.chatParticipant.upsert({
    where: {
      userId_chatId: {
        userId,
        chatId: groupChat.id,
      },
    },
    update: {},
    create: {
      userId,
      chatId: groupChat.id,
    },
  });
  return groupChat;
};
