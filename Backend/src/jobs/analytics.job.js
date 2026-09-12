import { getDashboardStats } from "../services/analytics.service.js";

/**
 * Lightweight background job to keep analytics warmed in memory
 */
export const runAnalyticsRefreshJob = async () => {
  try {
    const stats = await getDashboardStats();
    return stats;
  } catch (error) {
    console.warn("Analytics refresh job error:", error.message);
    return null;
  }
};

export default {
  runAnalyticsRefreshJob,
};
