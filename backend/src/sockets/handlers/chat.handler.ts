import { Server, Socket } from "socket.io";
import { SocketData } from "../../types/socket.types";
import * as ChatService from "../../modules/chat/chat.service";
import * as MessageService from "../../modules/chat/message/message.service";
import {
  joinChatSchema,
  leaveChatSchema,
  MessageCooldownError,
  sendMessageSchema,
} from "../../modules/chat/message/message.validation";
import { ackSuccess, ackError } from "../utils/ack";
import type { Ack } from "../utils/ack";

export const registerChatHendlers = (
  io: Server<any, any, any, SocketData>,
  socket: Socket<any, any, any, SocketData>,
) => {
  socket.on("chat:list", async () => {
    try {
      const userId = socket.data.userId;
      const chats = await ChatService.getUserChats(userId);
      console.log("chats", chats);

      socket.emit("chat:list:success", { chats });
    } catch (error) {
      socket.emit("chat:error", {
        message:
          error instanceof Error ? error.message : "Failed to load chats",
      });
    }

    socket.on("chat:joinAll", async () => {
      try {
        const userId = socket.data.userId;
        const chats = await ChatService.getUserChats(userId);

        for (const chat of chats) {
          socket.join(`chat:${chat.id}`);
        }

        socket.emit("chat:joinAll:success", {
          chatIds: chats.map((chat) => chat.id),
        });
      } catch (error) {
        socket.emit("chat:error", {
          message:
            error instanceof Error ? error.message : "Failed to join chats",
        });
      }
    });

    socket.on("chat:open", async (payload: { chatId: number }) => {
      try {
        const userId = socket.data.userId;
        const { chatId } = payload;

        await ChatService.ensureParticipant(chatId, userId);
        socket.join(`chat:${chatId}`);

        const messages = await ChatService.getChatMessages(chatId, userId);

        socket.emit("chat:open:success", {
          chatId,
          messages,
        });
      } catch (error) {
        socket.emit("chat:error", {
          message:
            error instanceof Error ? error.message : "Failed to open chat",
        });
      }
    });

    socket.on(
      "chat:send",
      async (payload: unknown) => {
        let chatId: number | null = null;

        try {
          const dto = sendMessageSchema.parse(payload);
          chatId = dto.chatId;
          const userId = socket.data.userId;

          const result = await MessageService.sendMessage(userId, dto);

          io.to(`chat:${dto.chatId}`).emit(
            "chat:message:new",
            result.userMessage,
          );

          if (result.botMessage) {
            io.to(`chat:${dto.chatId}`).emit(
              "chat:message:new",
              result.botMessage,
            );
          }
        } catch (error) {
          if (error instanceof MessageCooldownError && chatId) {
            socket.emit("chat:error", {
              chatId,
              cooldownUntil: Date.now() + error.retryAfterMs,
              message: error.message,
            });
            return;
          }

          socket.emit("chat:error", {
            message:
              error instanceof Error ? error.message : "Failed to send message",
          });
        }
      },
    );
  });
};
