import Notification from "../models/Notification.js";
import { getIO } from "../sockets/socket.js";

/**
 * Creates and dispatches notification to DB and real-time socket
 */
export const createNotification = async ({
  recipient = null,
  title,
  message,
  type = "info",
  link = "",
  issue = null,
}) => {
  try {
    const notif = await Notification.create({
      recipient,
      title,
      message,
      type,
      link,
      issue,
    });

    // Real-time socket push
    const io = getIO();
    if (io) {
      if (recipient) {
        io.to(`user_${recipient}`).emit("notification", notif);
      } else {
        io.emit("notification", notif);
      }
    }

    return notif;
  } catch (error) {
    console.warn("Failed to create notification:", error.message);
    return null;
  }
};

export const getUserNotifications = async (userId) => {
  return await Notification.find({
    $or: [{ recipient: userId }, { recipient: null }],
  })
    .sort({ createdAt: -1 })
    .limit(50);
};

export const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { $or: [{ recipient: userId }, { recipient: null }] },
    { read: true }
  );
};

export default {
  createNotification,
  getUserNotifications,
  markAllAsRead,
};
