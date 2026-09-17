import User from "../models/User.js";
import { ENV } from "../config/env.js";

/**
 * Seeds or verifies the authorized system administrator account
 */
export const seedAdmin = async () => {
  try {
    const adminEmail = ENV.ADMIN_EMAIL.toLowerCase();
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@123456";

    let admin = await User.findOne({ email: adminEmail }).select("+password");

    if (!admin) {
      admin = await User.create({
        name: "Chitransh Kumar (Super Administrator)",
        email: adminEmail,
        password: defaultPassword,
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&auto=format&fit=crop&q=80",
        phone: "+91 98765 43210",
        state: "Delhi",
        city: "New Delhi",
        zone: "Central Municipal Control Command",
        reputationScore: 500,
        isActive: true,
      });
      console.log(`✅ Default Administrator provisioned successfully: ${admin.email}`);
    } else {
      admin.role = "admin";
      admin.password = defaultPassword;
      admin.avatar = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&auto=format&fit=crop&q=80";
      admin.isActive = true;
      await admin.save();
      console.log(`✅ Administrator credentials and role verified for: ${admin.email}`);
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
