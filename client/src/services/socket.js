import { io } from "socket.io-client";
import { SOCKET_URL } from "./api";

let socket;

export const connectSocket = (token) => {
  if (!token) return null;

  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
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
