import { Server } from "socket.io";
import { ENV } from "../config/env.js";
import { verifyToken } from "../utils/generateToken.js";

let io = null;

const trustedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
].filter(Boolean);

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, "");
        if (trustedOrigins.includes(cleanOrigin)) return callback(null, true);
        if (ENV.NODE_ENV === "development" && (cleanOrigin.startsWith("http://localhost:") || cleanOrigin.startsWith("http://127.0.0.1:"))) {
          return callback(null, true);
        }
        return callback(new Error(`Socket CORS policy violation: Origin '${origin}' is not authorized.`), false);
      },
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      credentials: true,
    },
  });

  // Authentication middleware to verify user identity for private rooms
  io.use((socket, next) => {
    const rawToken =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "");

    if (rawToken) {
      try {
        const decoded = verifyToken(rawToken);
        socket.user = decoded;
      } catch {
        socket.user = null;
      }
    } else {
      socket.user = null;
    }
    next();
  });

  io.on("connection", (socket) => {
    // Automatically join authenticated user to their own private notification room
    if (socket.user?.id) {
      socket.join(`user_${socket.user.id}`);
    }

    // Explicit join_user request: strictly verify identity
    socket.on("join_user", (requestedUserId) => {
      if (socket.user && String(socket.user.id) === String(requestedUserId)) {
        socket.join(`user_${socket.user.id}`);
      } else {
        console.warn(`[Socket Security] Unauthorized attempt by socket ${socket.id} to join user room: ${requestedUserId}`);
      }
    });

    // Public issue room tracking for live complaint progress updates
    socket.on("join_issue", (issueId) => {
      if (issueId && typeof issueId === "string") {
        socket.join(`issue_${issueId.trim()}`);
      }
    });

    socket.on("disconnect", () => {
      // Clean disconnect
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

