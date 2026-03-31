import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { SocketData } from "../types/socket.types";
import { registerSocketMiddleware } from "./socket.middleware";
import { registerSocketEvents } from "./socket.events";

let io: SocketServer<any, any, any, SocketData>;

export const initSocket = (server: HttpServer) => {
  io = new SocketServer<any, any, any, SocketData>(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  registerSocketMiddleware(io);
  registerSocketEvents(io);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  return io;
};
