import { prisma } from "../../../config/db";
import { ChatType } from "../../../generated/prisma";
import * as ChatService from "../chat.service";
import { SendMessageDto, sendMessageSchema } from "./message.validation";
import { generateBotReply } from "../bot/bot.reply.service";

export const sendMessage = async (userId: number, dto: SendMessageDto) => {
  const validatedDto = sendMessageSchema.parse(dto);
  const sender = await prisma.user.findUnique({
    where: { id: userId },
    select: { isMuted: true },
  });

  if (!sender) {
    throw new Error("User not found");
  }

  if (sender.isMuted) {
    throw new Error("You are muted and cannot send messages");
  }

  await ChatService.ensureParticipant(validatedDto.chatId, userId);

  const result = await prisma.$transaction(async (tx) => {
    const chat = await tx.chat.findUnique({
      where: { id: validatedDto.chatId },
      select: {
        id: true,
        type: true,
      },
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    const userMessage = await tx.message.create({
      data: {
        chatId: validatedDto.chatId,
        senderId: userId,
        content: validatedDto.text,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            isBot: true,
            isMuted: true,
            isKicked: true,
          },
        },
      },
    });

    await tx.chat.update({
      where: { id: validatedDto.chatId },
      data: { updatedAt: new Date() },
    });

    return { chat, userMessage };
  });

  let botMessage: null | Awaited<ReturnType<typeof prisma.message.create>> =
    null;

  if (result.chat.type === ChatType.ASSISTANT) {
    const botUser = await prisma.user.findFirst({
      where: { isBot: true },
      select: { id: true },
    });

    if (botUser) {
      //if !ai ipi token
      //else
      const botReply = await generateBotReply(validatedDto.text);
      botMessage = await prisma.message.create({
        data: {
          chatId: validatedDto.chatId,
          senderId: botUser.id,
          content: botReply,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
              isBot: true,
              isMuted: true,
              isKicked: true,
            },
          },
        },
      });

      await prisma.chat.update({
        where: { id: validatedDto.chatId },
        data: { updatedAt: new Date() },
      });
    }
  }

  return {
    userMessage: result.userMessage,
    botMessage,
  };
  // const message = await prisma.message.create({
  //   data: {
  //     chatId: dto.chatId,
  //     senderId: userId,
  //     content: dto.text,
  //   },
  //   include: {
  //     sender: {
  //       select: {
  //         id: true,
  //         email: true,
  //         name: true,
  //       },
  //     },
  //   },
  // });
  // await prisma.chat.update({
  //   where: {
  //     id: dto.chatId,
  //   },
  //   data: {
  //     updatedAt: new Date(),
  //   },
  // });

  // return message;
};
