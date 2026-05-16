import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { ENV } from "../utils/env.js";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ENV.FRONTEND_URL,
      credentials: true,
    },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const token = socket.handshake.auth?.token;

    if (!token || !ENV.SECRET_KEY) {
      socket.disconnect(true);
      return;
    }

    try {
      const decoded = jwt.verify(token, ENV.SECRET_KEY);
      const userId = decoded.id;
      socket.data.userId = userId;
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      io.emit("presence:update", Array.from(onlineUsers.keys()));
    } catch {
      socket.disconnect(true);
      return;
    }

    socket.on("disconnect", () => {
      if (socket.data.userId) {
        onlineUsers.delete(socket.data.userId);
        io.emit("presence:update", Array.from(onlineUsers.keys()));
      }
    });
  });

  return io;
};
