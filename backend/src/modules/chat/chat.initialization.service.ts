import { prisma } from "../../config/db";
import { attachChatBotForUser } from "./bot/bot.chat.service";
import { attachUserToGroupChat } from "./chat.group.service";
import { ensureChatBot } from "./bot/bot.chat.service";
import { ensureGroupChat } from "./chat.group.service";

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
