import User from "../models/User.js";
import { ENV } from "../config/env.js";

/**
 * Seeds or verifies the authorized system administrator account
 * Safely provisions the initial administrator without resetting existing passwords or states.
 */
export const seedAdmin = async () => {
  try {
    const adminEmail = ENV.ADMIN_EMAIL.toLowerCase();

    let admin = await User.findOne({ email: adminEmail }).select("+password");

    if (!admin) {
      const initialPassword = ENV.ADMIN_INITIAL_PASSWORD || (ENV.NODE_ENV === "production" ? null : "DevAdmin@123456");

      if (!initialPassword) {
        console.warn(
          `⚠️ Administrator account '${adminEmail}' does not exist and ADMIN_INITIAL_PASSWORD is not set. Please set ADMIN_INITIAL_PASSWORD to provision the administrator.`
        );
      } else {
        admin = await User.create({
          name: "Chitransh Kumar (Super Administrator)",
          email: adminEmail,
          password: initialPassword,
          role: "admin",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&auto=format&fit=crop&q=80",
          phone: "+91 98765 43210",
          state: "Delhi",
          city: "New Delhi",
          zone: "Central Municipal Control Command",
          reputationScore: 500,
          isActive: true,
        });
        console.log(`✅ Initial Administrator provisioned successfully: ${admin.email}`);
      }
    } else {
      // Admin exists: DO NOT reset password, isActive, avatar, or profile data
      console.log(`✅ Administrator account verified: ${admin.email} (existing credentials preserved)`);
    }

    // Normalize existing citizen accounts: reset legacy 100 default to 0 and initialize civicPoints
    await User.updateMany(
      { role: "citizen", reputationScore: 100 },
      { $set: { reputationScore: 0 } }
    );
    await User.updateMany(
      { role: "citizen", civicPoints: { $exists: false } },
      { $set: { civicPoints: 0 } }
    );
  } catch (error) {
    console.error("Error seeding administrator:", error.message);
  }
};

export default seedAdmin;

