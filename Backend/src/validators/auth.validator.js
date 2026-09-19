import { ENV } from "../config/env.js";

export const validateRegister = (data = {}) => {
  const errors = [];
  const { name, email, password, role } = data;

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

  // Strict rule: Only citizen accounts may be created through public self-registration
  if (role !== undefined && role !== null) {
    const normalizedRole = String(role).trim().toLowerCase();
    if (normalizedRole !== "citizen") {
      errors.push(
        "Self-registration is restricted exclusively to Citizens. Field Worker and Administrator accounts must be provisioned by Municipal Administration."
      );
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

  if (phone !== undefined && typeof phone !== "string") {
    errors.push("Phone must be a valid string.");
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
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateProvisionWorker,
};

