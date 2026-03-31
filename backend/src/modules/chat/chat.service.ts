import { prisma } from "../../config/db";

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
