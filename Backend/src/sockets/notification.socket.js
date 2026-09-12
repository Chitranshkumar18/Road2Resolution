import { getIO } from "./socket.js";

/**
 * Handles notification-specific real-time socket events
 */
export const registerNotificationSocketHandlers = (socket) => {
  socket.on("subscribe_notifications", (userId) => {
    if (userId) {
      socket.join(`notifications_${userId}`);
    }
  });
};

export const pushUserNotification = (userId, notification) => {
  const io = getIO();
  if (io) {
    io.to(`notifications_${userId}`).emit("new_notification", notification);
  }
};

export default {
  registerNotificationSocketHandlers,
  pushUserNotification,
};
