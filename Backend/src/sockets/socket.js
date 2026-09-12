import { Server } from "socket.io";
import { ENV } from "../config/env.js";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

    // Join specific user room for targeted notifications
    socket.on("join_user", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    // Join room for specific issue tracking
    socket.on("join_issue", (issueId) => {
      if (issueId) {
        socket.join(`issue_${issueId}`);
      }
    });

    socket.on("disconnect", () => {
      // Disconnected
    });
  });

  return io;
};

export const getIO = () => io;

export const emitIssueUpdated = (issue) => {
  if (io) {
    io.emit("issue_updated", issue);
    if (issue.id) {
      io.to(`issue_${issue.id}`).emit("issue_details_updated", issue);
    }
  }
};

export default {
  initSocket,
  getIO,
  emitIssueUpdated,
};
