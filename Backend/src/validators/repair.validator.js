export const validateSubmitRepair = (data = {}) => {
  const errors = [];
  const afterImage = data.repairImageUrl || data.afterImageUrl;

  if (!afterImage) {
    errors.push("After-repair photographic proof is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateVerifyRepair = (data = {}) => {
  const errors = [];
  const repairImage = data.repairImageUrl || data.afterUrl || data.afterImageUrl;

  if (!repairImage && !data.auditData) {
    errors.push("Repair proof image or audit certification is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateSubmitRepair,
  validateVerifyRepair,
};
