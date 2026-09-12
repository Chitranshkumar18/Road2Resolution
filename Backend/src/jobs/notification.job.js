import Notification from "../models/Notification.js";

/**
 * Lightweight background task to clean up old read notifications (>30 days)
 */
export const runNotificationCleanupJob = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await Notification.deleteMany({
      read: true,
      createdAt: { $lt: thirtyDaysAgo },
    });
    if (result.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${result.deletedCount} old read notifications.`);
    }
  } catch (error) {
    console.warn("Notification cleanup job error:", error.message);
  }
};

export default {
  runNotificationCleanupJob,
};
