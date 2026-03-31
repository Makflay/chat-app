import { prisma } from "../../config/db";
import * as ChatService from "./chat.service";
import { SendMessageDto } from "./message.validation";

export const sendMessage = async (userId: number, dto: SendMessageDto) => {
  await ChatService.ensureParticipant(dto.chatId, userId);

  const message = await prisma.message.create({
    data: {
      chatId: dto.chatId,
      senderId: userId,
      content: dto.text,
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
  await prisma.chat.update({
    where: {
      id: dto.chatId,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  return message;
};
