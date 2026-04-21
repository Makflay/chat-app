import { prisma } from "../../config/db";
import { attachChatBotForUser } from "./bot.chat.service";
import { attachUserToGroupChat } from "./group.chat.service";
import { ensureChatBot } from "./bot.chat.service";
import { ensureGroupChat } from "./group.chat.service";

export const attachDefaultChatForUser = async (
  userId: number,
): Promise<void> => {
  await attachChatBotForUser(userId);
  await attachUserToGroupChat(userId);
};

export const chatInitializationService = async () => {
  await ensureChatBot();
  await ensureGroupChat();

  const users = await prisma.user.findMany({
    where: { isBot: false },
    select: { id: true },
  });

  for (const user of users) {
    await attachDefaultChatForUser(user.id);
  }
};
