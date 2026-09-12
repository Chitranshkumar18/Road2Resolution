export const validateReview = (data = {}) => {
  const errors = [];
  const { rating, comment } = data;

  if (!comment || typeof comment !== "string" || !comment.trim()) {
    errors.push("Feedback comment text is required.");
  }

  if (rating !== undefined && (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5)) {
    errors.push("Rating must be a numeric score between 1 and 5.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateReview,
};
