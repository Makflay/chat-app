import { Server, Socket } from "socket.io";
import { SocketData } from "../types/socket.types";
import { registerChatHendlers } from "./handlers/chat.handler";
import { registerMessageHandlers } from "./handlers/message.handler";

export const registerSocketEvents = (io: Server<any, any, any, SocketData>) => {
  io.on("connection", (socket: Socket<any, any, any, SocketData>) => {
    const userId = socket.data.userId;
    console.log("Socket id, userId", socket.id, userId);

    socket.join(`user: ${userId}`);

    registerChatHendlers(io, socket);
    registerMessageHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    });
  });
};
