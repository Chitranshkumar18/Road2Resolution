import crypto from "crypto";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Issue from "../models/Issue.js";
import ApiError from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";
import { sanitizeUser, calculateWorkerStats } from "../utils/helpers.js";
import { uploadImage } from "./cloudinary.service.js";
import { ENV } from "../config/env.js";

/**
 * Registers a new citizen or worker account (Public Self-Registration)
 * Restricts public registration strictly to Citizens and Workers (Never Admin).
 */
export const register = async (userData) => {
  const { name, email, password, role, phone, zone, state, city, address, workerType, organizationName } = userData;

  const cleanEmail = (email || "").trim().toLowerCase();

  // Strict role check: Public registration is restricted to Citizens and Workers
  const normalizedRole = role !== undefined && role !== null ? String(role).trim().toLowerCase() : "citizen";
  if (normalizedRole !== "citizen" && normalizedRole !== "worker") {
    throw new ApiError(
      400,
      "Self-registration is restricted exclusively to Citizens and Workers. Administrator accounts cannot be registered."
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    throw new ApiError(409, "An account with this email address already exists.");
  }

  let user;

  if (normalizedRole === "citizen") {
    // Strict allowlist for public citizen registration
    user = await User.create({
      name: (name || "").trim(),
      email: cleanEmail,
      password,
      role: "citizen",
      phone: phone ? String(phone).trim() : "",
      zone: zone ? String(zone).trim() : "Municipal Zone",
      state: state ? String(state).trim() : "Delhi",
      city: city ? String(city).trim() : "New Delhi",
      address: address || "",
      civicPoints: 0,
      reputationScore: 0,
      isActive: true,
    });
  } else {
    // Worker registration (Individual or Organization/Contractor)
    const normalizedWorkerType = workerType ? String(workerType).trim().toLowerCase() : "individual";
    if (normalizedWorkerType !== "individual" && normalizedWorkerType !== "organization") {
      throw new ApiError(400, "Worker type must be either 'individual' or 'organization'.");
    }

    if (normalizedWorkerType === "organization") {
      const orgName = (organizationName || "").trim();
      if (!orgName) {
        throw new ApiError(400, "Organization or Contractor company name is required.");
      }

      // Create new organization in database
      const orgCustomId = `org_contractor_${Date.now()}_${crypto.randomBytes(2).toString("hex")}`;
      const newOrg = await Organization.create({
        id: orgCustomId,
        name: orgName,
        categoryIds: ["pothole", "other"],
        categoryLabels: ["Road Damage & Pothole"],
        state: state ? String(state).trim() : "Delhi",
        city: city ? String(city).trim() : "New Delhi",
        serviceArea: zone ? String(zone).trim() : "Metropolitan Region",
        type: "PRIVATE_CONTRACTOR",
        headOfOrg: (name || "Chief Contractor").trim(),
        phone: phone ? String(phone).trim() : "",
        email: cleanEmail,
        activeWorkers: 1,
        slaRating: "95%",
        isActive: true,
      });

      // Create primary worker user linked to this organization
      user = await User.create({
        name: (name || "").trim(),
        email: cleanEmail,
        password,
        role: "worker",
        workerType: "organization",
        phone: phone ? String(phone).trim() : "",
        zone: zone ? String(zone).trim() : "Municipal Zone",
        state: state ? String(state).trim() : "Delhi",
        city: city ? String(city).trim() : "New Delhi",
        contractorUnit: orgName,
        organizationName: orgName,
        organization: newOrg._id,
        skills: [],
        civicPoints: 0,
        reputationScore: 100,
        isActive: true,
      });
    } else {
      // Individual worker registration
      user = await User.create({
        name: (name || "").trim(),
        email: cleanEmail,
        password,
        role: "worker",
        workerType: "individual",
        phone: phone ? String(phone).trim() : "",
        zone: zone ? String(zone).trim() : "Municipal Zone",
        state: state ? String(state).trim() : "Delhi",
        city: city ? String(city).trim() : "New Delhi",
        contractorUnit: "Independent Field Worker",
        organizationName: "",
        organization: null,
        skills: [],
        civicPoints: 0,
        reputationScore: 100,
        isActive: true,
      });
    }
  }

  const sanitized = sanitizeUser(user);
  if (user.role === "worker") {
    const issues = await Issue.find({}).populate("repairs").lean();
    const stats = calculateWorkerStats(issues, user);
    Object.assign(sanitized, stats);
  }
  const token = generateToken(user._id, user.role);

  return {
    user: sanitized,
    token,
  };
};

/**
 * Provisions a new worker account (Admin-only mechanism)
 */
export const provisionWorker = async (workerData) => {
  const {
    name,
    email,
    password,
    phone = "",
    zone = "North Zone, Delhi NCR",
    state = "Delhi",
    city = "New Delhi",
    contractorUnit = "",
    organizationName = "",
    organization = null,
    skills = [],
  } = workerData;

  const cleanEmail = (email || "").trim().toLowerCase();

  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    throw new ApiError(409, "An account with this email address already exists.");
  }

  const worker = await User.create({
    name: (name || "").trim(),
    email: cleanEmail,
    password,
    role: "worker",
    phone: phone ? String(phone).trim() : "",
    zone: zone ? String(zone).trim() : "Municipal Zone",
    state: state ? String(state).trim() : "Delhi",
    city: city ? String(city).trim() : "New Delhi",
    contractorUnit: contractorUnit ? String(contractorUnit).trim() : "Municipal Rapid Repair Unit",
    organizationName: organizationName ? String(organizationName).trim() : (contractorUnit || "Delhi PWD"),
    organization: organization || null,
    skills: Array.isArray(skills) ? skills : [],
    civicPoints: 0,
    reputationScore: 100,
    isActive: true,
  });

  return sanitizeUser(worker);
};

/**
 * Authenticates user and returns JWT token
 */
export const login = async (email, password, preferredRole = "citizen") => {
  const cleanEmail = (email || "").trim().toLowerCase();

  // Admin email verification
  if (preferredRole === "admin" && cleanEmail !== ENV.ADMIN_EMAIL.toLowerCase()) {
    throw new ApiError(
      403,
      "Invalid admin email address. Admin access is restricted to the authorized administrator."
    );
  }

  const user = await User.findOne({ email: cleanEmail }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account has been suspended.");
  }

  const sanitized = sanitizeUser(user);
  if (user.role === "worker") {
    const issues = await Issue.find({}).populate("repairs").lean();
    const stats = calculateWorkerStats(issues, user);
    Object.assign(sanitized, stats);
  }
  const token = generateToken(user._id, user.role);

  return {
    user: sanitized,
    token,
  };
};

/**
 * Gets currently authenticated user by ID
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  const sanitized = sanitizeUser(user);
  if (user.role === "worker") {
    const issues = await Issue.find({}).populate("repairs").lean();
    const stats = calculateWorkerStats(issues, user);
    Object.assign(sanitized, stats);
  }
  return sanitized;
};

/**
 * Updates user profile details using a strict role-based allowlist
 */
export const updateProfile = async (userId, updates = {}) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new ApiError(404, "User not found.");
  }

  const allowedUpdates = {};

  // Common allowed fields
  if (typeof updates.name === "string" && updates.name.trim()) {
    allowedUpdates.name = updates.name.trim();
  }

  if (typeof updates.phone === "string") {
    allowedUpdates.phone = updates.phone.trim();
  }

  if (typeof updates.zone === "string" && updates.zone.trim()) {
    allowedUpdates.zone = updates.zone.trim();
  }

  // Citizen specific editable fields
  if (existingUser.role === "citizen") {
    if (updates.address !== undefined) allowedUpdates.address = updates.address;
    if (typeof updates.city === "string") allowedUpdates.city = updates.city.trim();
    if (typeof updates.state === "string") allowedUpdates.state = updates.state.trim();
  }

  // Worker specific editable fields (skills)
  if (existingUser.role === "worker") {
    if (Array.isArray(updates.skills)) {
      allowedUpdates.skills = updates.skills.map((s) => String(s).trim()).filter(Boolean);
    }
  }

  // Avatar handling (safe image upload)
  if (
    updates.avatar &&
    typeof updates.avatar === "string" &&
    (updates.avatar.startsWith("data:image/") || updates.avatar.startsWith("http://") || updates.avatar.startsWith("https://"))
  ) {
    try {
      allowedUpdates.avatar = await uploadImage(updates.avatar, "civicvision/avatars");
    } catch (e) {
      console.warn("Avatar upload processing note:", e.message);
    }
  } else if (updates.avatar === "") {
    allowedUpdates.avatar = "";
  }

  // Strictly execute update with only sanitized, allowlisted keys
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { returnDocument: "after", runValidators: true }
  ).select("-password");

  const sanitized = sanitizeUser(user);
  if (user.role === "worker") {
    const issues = await Issue.find({}).populate("repairs").lean();
    const stats = calculateWorkerStats(issues, user);
    Object.assign(sanitized, stats);
  }
  return sanitized;
};

export default {
  register,
  provisionWorker,
  login,
  getCurrentUser,
  updateProfile,
};

