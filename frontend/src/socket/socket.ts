import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/auth-store";

const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const getAccessToken = () => useAuthStore.getState().token;
let socket: Socket | null = null;

export const connectSocket = () => {
  if (socket) return socket;

  socket = io(VITE_SOCKET_URL, {
    auth: {
      token: getAccessToken(),
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
