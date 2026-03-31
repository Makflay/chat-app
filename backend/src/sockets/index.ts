import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { SocketData } from "../types/socket.types";

let io: SocketServer<any, any, any, SocketData>;

export const initSocket = (server: HttpServer) => {
  io = new SocketServer<any, any, any, SocketData>(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  //middleware
  //events

  return io;
};
