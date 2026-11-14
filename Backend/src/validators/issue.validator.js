import { ISSUE_STATUSES } from "../utils/constants.js";

export const validateCreateIssue = (data = {}) => {
  const errors = [];
  const { title, category, imageUrl, address, lat, lng } = data;

  if (!imageUrl && !data.image) {
    errors.push("Evidence image photograph is required.");
  }

  if (lat === undefined || lat === null || isNaN(Number(lat))) {
    errors.push("Valid GPS latitude is required.");
  }

  if (lng === undefined || lng === null || isNaN(Number(lng))) {
    errors.push("Valid GPS longitude is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateStatus = (data = {}) => {
  const errors = [];
  const { status } = data;

  if (!status || !Object.values(ISSUE_STATUSES).includes(status)) {
    errors.push(`Invalid status. Must be one of: ${Object.values(ISSUE_STATUSES).join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAssignOrganization = (data = {}) => {
  const errors = [];
  const { organizationId } = data;

  if (!organizationId) {
    errors.push("Target Organization ID is required for assignment.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAcceptWork = (data = {}) => {
  const errors = [];
  const workerInfo = data.workerInfo || data.volunteerInfo || data;

  if (!workerInfo.name || !workerInfo.name.trim()) {
    errors.push("Worker or Volunteer name is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateCreateIssue,
  validateUpdateStatus,
  validateAssignOrganization,
  validateAcceptWork,
};
