import { Server, Socket } from "socket.io";
import { SocketData } from "../../types/socket.types";
import { sendMessageSchema } from "../../modules/chat/message.validation";
import { sendMessage } from "../../modules/chat/message.service";
import * as ChatService from "../../modules/chat/chat.service";
import { ackSuccess, ackError } from "../utils/ack";
import type { Ack } from "../utils/ack";

export const registerMessageHandlers = (
  io: Server<any, any, any, SocketData>,
  socket: Socket<any, any, any, SocketData>,
) => {
  socket.on("message:send", async (payload: unknown, ack?: Ack) => {
    try {
      const dto = sendMessageSchema.parse(payload);
      const userId = socket.data.userId;

      const message = await sendMessage(userId, dto);

      io.to(`chat: ${dto.chatId}`).emit("message:new", {
        chatId: dto.chatId,
        message,
      });

      const participantUserIds = await ChatService.getParticipantUserIds(
        dto.chatId,
      );

      for (const participantUserId of participantUserIds) {
        io.to(`user: ${participantUserId}`).emit("chat:list:update", {
          chatId: dto.chatId,
          lastMessage: message,
        });
      }

      ackSuccess(ack, { chatId: dto.chatId });
    } catch (error) {
      ackError(ack, error, "Failed to send message");
    }
  });
};
