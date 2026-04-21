import { io, Socket } from "socket.io-client";

const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(VITE_SOCKET_URL, {
    auth: {
      token: token,
    },
    transports: ["websocket"],
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
