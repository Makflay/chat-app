import { Server, Socket } from "socket.io";
import { SocketData } from "../types/socket.types";
//register chat
//register message

const registerSocketEvents = (io: Server<any, any, any, SocketData>) => {
  io.on("connection", (socket: Socket<any, any, any, SocketData>) => {
    const userId = socket.data.userId;
    console.log("Socket id, userId", socket.id, userId);

    socket.join(`user: ${userId}`);

    //register chat
    //register message

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    });
  });
};
