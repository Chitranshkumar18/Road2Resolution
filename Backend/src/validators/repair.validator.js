export const validateSubmitRepair = (data = {}) => {
  const errors = [];
  const afterImage = data.repairImageUrl || data.afterImageUrl;

  if (!afterImage) {
    errors.push("After-repair photographic proof is required.");
  }

  if (data.capturedAt) {
    const capTime = new Date(data.capturedAt).getTime();
    if (isNaN(capTime)) {
      errors.push("Invalid photo capture timestamp.");
    } else {
      const ageSeconds = (Date.now() - capTime) / 1000;
      if (ageSeconds > 65) {
        errors.push("Captured photo proof expired (exceeded 60-second limit). Please capture a new live photo.");
      }
    }
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
