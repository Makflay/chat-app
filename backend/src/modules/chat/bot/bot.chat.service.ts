import { prisma } from "../../../config/db";
import { Prisma } from "../../../generated/prisma";
import { ChatType, Role } from "../../../generated/prisma";
import type { User } from "../../../types/user.types";
import "../../../config/env";

export const ensureChatBot = async (): Promise<User> => {
  try {
    const botEmail = process.env.BOT_EMAIL!;
    const botName = process.env.BOT_NAME!;
    const botPassword = process.env.BOT_PASSWORD!;

    if (!botEmail || !botName || !botPassword) {
      throw new Error("Bot credetinals are not set in .env");
    }

    const existingBot = await prisma.user.findUnique({
      where: { email: botEmail },
    });

    if (existingBot) {
      console.log("Bot already exist");
      return existingBot;
    }

    const newBot: Prisma.UserCreateInput = {
      email: botEmail,
      password: botPassword,
      username: botName,
      role: Role.USER,
      isBot: true,
    };
    const createdBot = await prisma.user.create({ data: newBot });
    return createdBot;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Creating chat bot error: ${error}`);
    } else {
      throw new Error("Creating chat bot unknown error");
    }
  }
};

export const attachChatBotForUser = async (userId: number) => {
  const bot = await ensureChatBot();

  const existingChat = await prisma.chat.findFirst({
    where: {
      type: ChatType.ASSISTANT,
      ownerUserId: userId,
    },
  });

  if (existingChat) {
    return existingChat;
  }

  return prisma.$transaction(async (tx) => {
    const chat = await tx.chat.create({
      data: {
        type: ChatType.ASSISTANT,
        title: "Assistant",
        ownerUserId: userId,
        isDefault: true,
      },
    });

    await tx.chatParticipant.createMany({
      data: [
        { userId, chatId: chat.id },
        { userId: bot.id, chatId: chat.id },
      ],
      skipDuplicates: true,
    });

    await tx.message.create({
      data: {
        chatId: chat.id,
        senderId: bot.id,
        content: "Hello, I'm online",
      },
    });

    return chat;
  });
};
