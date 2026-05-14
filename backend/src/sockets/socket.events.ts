import { Server, Socket } from "socket.io";
import { SocketData } from "../types/socket.types";
import { registerChatHendlers } from "./handlers/chat.handler";
import { registerMessageHandlers } from "./handlers/message.handler";
import { registerAdminHandlers } from "./handlers/admin.handler";

const onlineUsers = new Map<
  number,
  {
    username: string;
    role: SocketData["role"];
    socketIds: Set<string>;
  }
>();

const emitPresenceUpdate = (io: Server<any, any, any, SocketData>) => {
  const users = Array.from(onlineUsers.entries()).map(([id, user]) => ({
    id,
    username: user.username,
    role: user.role,
  }));

  io.emit("presence:update", {
    onlineUsers: users,
    onlineUserIds: users.map((user) => user.id),
  });
};

export const registerSocketEvents = (io: Server<any, any, any, SocketData>) => {
  io.on("connection", (socket: Socket<any, any, any, SocketData>) => {
    const userId = socket.data.userId;
    console.log("Socket id, userId", socket.id, userId);

    socket.join(`user: ${userId}`);

    const onlineUser = onlineUsers.get(userId);

    if (onlineUser) {
      onlineUser.socketIds.add(socket.id);
    } else {
      onlineUsers.set(userId, {
        username: socket.data.username,
        role: socket.data.role,
        socketIds: new Set([socket.id]),
      });
    }

    emitPresenceUpdate(io);

    registerChatHendlers(io, socket);
    registerMessageHandlers(io, socket);
    registerAdminHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);

      const onlineUser = onlineUsers.get(userId);

      if (!onlineUser) {
        emitPresenceUpdate(io);
        return;
      }

      onlineUser.socketIds.delete(socket.id);

      if (onlineUser.socketIds.size === 0) {
        onlineUsers.delete(userId);
      }

      emitPresenceUpdate(io);
    });
  });
};
