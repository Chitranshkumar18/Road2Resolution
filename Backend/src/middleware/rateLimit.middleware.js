import ApiError from "../utils/ApiError.js";

/**
 * In-memory sliding window rate limiter
 * @param {Object} options
 * @param {number} options.windowMs Window size in milliseconds
 * @param {number} options.max Maximum requests per window
 * @param {string} options.message Error message
 * @param {function} options.keyGenerator Key generator function (default: IP)
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = "Too many requests, please try again later.",
  keyGenerator = (req) => req.user?._id || req.ip || req.headers["x-forwarded-for"] || "global",
} = {}) => {
  const store = new Map();

  // Cleanup expired entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = String(keyGenerator(req));

    let record = store.get(key);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      store.set(key, record);
      return next();
    }

    record.count++;
    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSeconds);
      return next(new ApiError(429, `${message} Try again in ${retryAfterSeconds} seconds.`));
    }

    next();
  };
};

// Specialized rate limiters
export const aiImageRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "AI Vision scan rate limit exceeded.",
});

export const aiDuplicateRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: "Duplicate check rate limit exceeded.",
});

export const publicReviewRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Review submission rate limit exceeded.",
});

export const publicUpvoteRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Upvote rate limit exceeded.",
});

export const generalApiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "API request rate limit exceeded.",
});

export default {
  createRateLimiter,
  aiImageRateLimiter,
  aiDuplicateRateLimiter,
  publicReviewRateLimiter,
  publicUpvoteRateLimiter,
  generalApiRateLimiter,
};
