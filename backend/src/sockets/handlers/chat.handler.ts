import { Server, Socket } from "socket.io";
import { SocketData } from "../../types/socket.types";
import * as ChatService from "../../modules/chat/chat.service";
import {
  joinChatSchema,
  leaveChatSchema,
} from "../../modules/chat/message.validation";
import { ackSuccess, ackError } from "../utils/ack";
import type { Ack } from "../utils/ack";

export const registerChatHendlers = (
  _io: Server<any, any, any, SocketData>,
  socket: Socket<any, any, any, SocketData>,
) => {
  socket.on("chat:join", async (payload: unknown, ack?: Ack) => {
    try {
      const dto = joinChatSchema.parse(payload);
      const userId = socket.data.userId;

      await ChatService.ensureParticipant(dto.chatId, userId);

      socket.join(`chat: ${dto.chatId}`);

      ackSuccess(ack, { chatId: dto.chatId });
    } catch (error) {
      ackError(ack, error, "Failed to join chat");
    }
  });

  socket.on("chat:leave", async (payload: unknown, ack?: Ack) => {
    try {
      const dto = leaveChatSchema.parse(payload);
      const userId = socket.data.userId;

      await ChatService.ensureParticipant(dto.chatId, userId);

      socket.leave(`chat: ${dto.chatId}`);

      ackSuccess(ack, { chatId: dto.chatId });
    } catch (error) {
      ackError(ack, error, "Failed to leave chat");
    }
  });
};
