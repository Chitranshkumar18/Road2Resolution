import Organization from "../models/Organization.js";
import { INITIAL_ORGANIZATIONS } from "../utils/constants.js";

/**
 * Seeds initial organizations across Delhi, Punjab, Maharashtra, Karnataka, UP, and Tamil Nadu
 */
export const seedOrganizations = async () => {
  try {
    for (const orgData of INITIAL_ORGANIZATIONS) {
      const existing = await Organization.findOne({ id: orgData.id });
      if (!existing) {
        await Organization.create(orgData);
      }
    }
    console.log("✅ Initial municipal and contractor organizations verified and seeded.");
  } catch (error) {
    console.error("Error seeding organizations:", error.message);
  }
};

export default seedOrganizations;
