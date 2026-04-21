import { prisma } from "../../config/db";

export const getChatById = async (chatId: number) => {
  return prisma.chat.findUnique({
    where: { id: chatId },
  });
};

export const isParticipant = async (
  chatId: number,
  userId: number,
): Promise<boolean> => {
  const participant = await prisma.chatParticipant.findFirst({
    where: {
      chatId,
      userId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(participant);
};

export const ensureParticipant = async (
  chatId: number,
  userId: number,
): Promise<void> => {
  const participant = await isParticipant(chatId, userId);

  if (!participant) {
    throw new Error("Access denied");
  }
};

export const getParticipantUserIds = async (
  chatId: number,
): Promise<number[]> => {
  const participants = await prisma.chatParticipant.findMany({
    where: { chatId },
    select: { userId: true },
  });

  return participants.map((p) => p.userId);
};

export const getUserChats = async (userId: number) => {
  const chats = await prisma.chat.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              isBot: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              isBot: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  console.log("getUserChats chats", chats);

  return chats.map((chat) => ({
    id: chat.id,
    type: chat.type,
    title: chat.title,
    isDefault: chat.isDefault,
    ownerUserId: chat.ownerUserId,
    participants: chat.participants.map((p) => ({
      id: p.user.id,
      username: p.user.username,
      isBot: p.user.isBot,
    })),
    lastMessage: chat.messages[0]
      ? {
          id: chat.messages[0].id,
          content: chat.messages[0].content,
          createdAt: chat.messages[0].createdAt,
          sender: chat.messages[0].sender,
        }
      : null,
  }));
};

export const getChatMessages = async (chatId: number, userId: number) => {
  await ensureParticipant(chatId, userId);

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          email: true,
          isBot: true,
        },
      },
    },
  });

  return messages;
};
