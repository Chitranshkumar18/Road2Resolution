export const validateCreateOrganization = (data = {}) => {
  const errors = [];
  const { name, state, city } = data;

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Organization name is required.");
  }

  if (!state || typeof state !== "string" || !state.trim()) {
    errors.push("Operating State is required.");
  }

  if (!city || typeof city !== "string" || !city.trim()) {
    errors.push("Operating City is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateCreateOrganization,
};
