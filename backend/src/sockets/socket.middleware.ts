import { Server, Socket } from "socket.io";
import { verifyToken } from "../utils/jwt";
import { SocketData } from "../types/socket.types";

export const registerSocketMiddleware = (
  io: Server<any, any, any, SocketData>,
) => {
  io.use((socket: Socket<any, any, any, SocketData>, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token || typeof token !== "string") {
        throw new Error("Unauthorized");
      }

      const payload = verifyToken(token);

      if (!payload?.id) {
        throw new Error("Unauthorized");
      }

      socket.data.userId = payload.id;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });
};
