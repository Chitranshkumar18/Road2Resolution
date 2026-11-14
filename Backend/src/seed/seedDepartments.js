import Department from "../models/Department.js";
import { DEPARTMENTS } from "../utils/constants.js";

/**
 * Seeds initial 5 standard municipal departments
 */
export const seedDepartments = async () => {
  try {
    for (const deptData of DEPARTMENTS) {
      const existing = await Department.findOne({ id: deptData.id });
      if (!existing) {
        await Department.create(deptData);
      }
    }
    console.log("✅ Municipal departments verified and seeded.");
  } catch (error) {
    console.error("Error seeding departments:", error.message);
  }
};

export default seedDepartments;
