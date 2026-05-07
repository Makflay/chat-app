import { Server, Socket } from "socket.io";
import { z } from "zod";
import { SocketData } from "../../types/socket.types";
import {
  muteUser,
  unmuteUser,
} from "../../modules/chat/admin/admin.mute.service";
import { ackSuccess, ackError } from "../utils/ack";
import type { Ack } from "../utils/ack";

const adminUserActionSchema = z.object({
  userId: z.number().int().positive(),
});

const ensureAdmin = (socket: Socket<any, any, any, SocketData>) => {
  if (socket.data.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
};

export const registerAdminHandlers = (
  io: Server<any, any, any, SocketData>,
  socket: Socket<any, any, any, SocketData>,
) => {
  socket.on("admin:user:mute", async (payload: unknown, ack?: Ack) => {
    try {
      ensureAdmin(socket);
      const { userId } = adminUserActionSchema.parse(payload);
      const user = await muteUser(userId);

      io.to(`user: ${userId}`).emit("user:muted", { user });
      ackSuccess(ack, { user });
    } catch (error) {
      ackError(ack, error, "Failed to mute user");
    }
  });

  socket.on("admin:user:unmute", async (payload: unknown, ack?: Ack) => {
    try {
      ensureAdmin(socket);
      const { userId } = adminUserActionSchema.parse(payload);
      const user = await unmuteUser(userId);

      io.to(`user: ${userId}`).emit("user:unmuted", { user });
      ackSuccess(ack, { user });
    } catch (error) {
      ackError(ack, error, "Failed to unmute user");
    }
  });
};
