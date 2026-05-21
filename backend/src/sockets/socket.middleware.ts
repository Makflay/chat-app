import { Server, Socket } from "socket.io";
import { prisma } from "../config/db";
import { verifyToken } from "../utils/jwt";
import { SocketData } from "../types/socket.types";

export const registerSocketMiddleware = (
  io: Server<any, any, any, SocketData>,
) => {
  io.use(async (socket: Socket<any, any, any, SocketData>, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token || typeof token !== "string") {
        throw new Error("Unauthorized");
      }

      const payload = verifyToken(token);

      if (!payload?.id) {
        throw new Error("Unauthorized");
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          username: true,
          role: true,
          isKicked: true,
          activeSessionId: true,
        },
      });

      if (
        !user ||
        user.isKicked ||
        user.activeSessionId !== payload.sessionId
      ) {
        throw new Error("Unauthorized");
      }

      socket.data.userId = user.id;
      socket.data.username = user.username;
      socket.data.role = user.role;
      socket.data.sessionId = payload.sessionId;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });
};
