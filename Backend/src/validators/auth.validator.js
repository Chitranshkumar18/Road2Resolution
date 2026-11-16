import { ENV } from "../config/env.js";

/**
 * Validates whether the given string is a valid 10-digit mobile number.
 * Accepts formats: 9812345678, +91 98123 45678, +919812345678, 09812345678, 98123-45678.
 */
export const isValidMobileNumber = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  const trimmed = phone.trim();
  if (!trimmed) return false;
  const stripped = trimmed.replace(/[\s\-\(\)\.]/g, "");
  return /^(\+91|91|0)?[6-9]\d{9}$/.test(stripped) || /^[1-9]\d{9}$/.test(stripped);
};

export const validateRegister = (data = {}) => {
  const errors = [];
  const { name, email, password, role, phone } = data;

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Full name is required.");
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("Valid email address is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("Please provide a valid email format.");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }

  // Strict role check: Public registration is allowed for Citizens and Workers (Never Admin)
  const normalizedRole = role !== undefined && role !== null ? String(role).trim().toLowerCase() : "citizen";
  if (normalizedRole !== "citizen" && normalizedRole !== "worker") {
    errors.push(
      "Self-registration is restricted exclusively to Citizens and Workers. Administrator accounts cannot be registered."
    );
  }

  if (normalizedRole === "worker") {
    const workerType = data.workerType ? String(data.workerType).trim().toLowerCase() : "individual";
    if (workerType !== "individual" && workerType !== "organization") {
      errors.push("Worker type must be either 'individual' or 'organization'.");
    }
    if (workerType === "organization") {
      if (!data.organizationName || typeof data.organizationName !== "string" || !data.organizationName.trim()) {
        errors.push("Organization or Contractor company name is required for organization worker registration.");
      }
    }
  }

  // Mobile number validation (when phone is provided)
  if (phone !== undefined && phone !== null && String(phone).trim() !== "") {
    if (!isValidMobileNumber(String(phone))) {
      errors.push("Please provide a valid 10-digit mobile number.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLogin = (data = {}) => {
  const errors = [];
  const { email, password, role } = data;

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("Email address is required.");
  }

  if (!password || typeof password !== "string") {
    errors.push("Password is required.");
  }

  // Admin login restriction
  if (role === "admin") {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (cleanEmail !== ENV.ADMIN_EMAIL.toLowerCase()) {
      errors.push("Invalid admin email address. Admin access is restricted to the authorized administrator.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateProfile = (data = {}) => {
  const errors = [];
  const { name, phone, email } = data;

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    errors.push("Name cannot be empty.");
  }

  if (phone !== undefined && phone !== null && String(phone).trim() !== "") {
    if (!isValidMobileNumber(String(phone))) {
      errors.push("Phone must be a valid 10-digit mobile number.");
    }
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    errors.push("Please provide a valid email format.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProvisionWorker = (data = {}) => {
  const errors = [];
  const { name, email, password } = data;

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Worker full name is required.");
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("Valid worker email address is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("Please provide a valid email format.");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Initial password must be at least 6 characters long.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  isValidMobileNumber,
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateProvisionWorker,
};

