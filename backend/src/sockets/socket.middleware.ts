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
        select: { id: true, role: true, isKicked: true },
      });

      if (!user || user.isKicked) {
        throw new Error("Unauthorized");
      }

      socket.data.userId = user.id;
      socket.data.role = user.role;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });
};
