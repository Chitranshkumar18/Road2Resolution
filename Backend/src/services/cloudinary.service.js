import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { PLACEHOLDER_IMAGES } from "../utils/constants.js";
import ApiError from "../utils/ApiError.js";

/**
 * Checks if a hostname or IP is a private/loopback/internal address (SSRF guard)
 */
export const isPrivateOrInternalHost = (hostname) => {
  if (!hostname) return true;
  const host = hostname.toLowerCase().trim();

  // Localhost & loopback
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host === "[::1]" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return true;
  }

  // Cloud metadata services
  if (host === "169.254.169.254" || host === "metadata.google.internal" || host.includes("metadata")) {
    return true;
  }

  // IPv4 Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16
  const ipMatch = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipMatch) {
    const [, b1, b2] = ipMatch.map(Number);
    if (b1 === 10) return true;
    if (b1 === 127) return true;
    if (b1 === 169 && b2 === 254) return true;
    if (b1 === 172 && b2 >= 16 && b2 <= 31) return true;
    if (b1 === 192 && b2 === 168) return true;
    if (b1 === 0) return true;
  }

  return false;
};

/**
 * Validates and uploads an image buffer, base64 data string, or remote URL to Cloudinary
 * @param {Buffer|string} fileSource Image buffer, base64 data string, or URL
 * @param {string} folder Cloudinary storage folder (default: 'civicvision/issues')
 */
export const uploadImage = async (fileSource, folder = "civicvision/issues") => {
  if (!fileSource) return null;

  // 1. Data URL Handling
  if (typeof fileSource === "string" && fileSource.startsWith("data:")) {
    if (!/^data:image\/(jpeg|jpg|png|webp|heic);base64,/i.test(fileSource)) {
      throw new ApiError(400, "Invalid image data format. Only JPG, PNG, WebP, and HEIC image data are accepted.");
    }
    // Max 14MB base64 payload limit (~10MB binary equivalent)
    if (fileSource.length > 14 * 1024 * 1024) {
      throw new ApiError(400, "Image payload exceeds the 10MB maximum limit.");
    }
  }

  // 2. Remote URL Handling with SSRF Protection
  if (typeof fileSource === "string" && (fileSource.startsWith("http://") || fileSource.startsWith("https://"))) {
    try {
      const parsedUrl = new URL(fileSource);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        throw new ApiError(400, "Invalid URL protocol. Only HTTP and HTTPS are permitted.");
      }
      if (isPrivateOrInternalHost(parsedUrl.hostname)) {
        throw new ApiError(400, "Image URL points to a restricted internal or loopback address.");
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(400, "Malformed image URL provided.");
    }
  }

  // If Cloudinary credentials are not configured, return base64 or placeholder safely
  if (!isCloudinaryConfigured()) {
    if (typeof fileSource === "string" && (fileSource.startsWith("data:") || fileSource.startsWith("http"))) {
      return fileSource;
    }
    if (Buffer.isBuffer(fileSource)) {
      return `data:image/jpeg;base64,${fileSource.toString("base64")}`;
    }
    return PLACEHOLDER_IMAGES.defaultIssue;
  }

  try {
    if (Buffer.isBuffer(fileSource)) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url || result.url);
          }
        );
        stream.end(fileSource);
      });
    }

    if (typeof fileSource === "string") {
      const result = await cloudinary.uploader.upload(fileSource, {
        folder,
        resource_type: "image",
      });
      return result.secure_url || result.url;
    }

    return PLACEHOLDER_IMAGES.defaultIssue;
  } catch (error) {
    console.warn("Cloudinary upload failed, falling back safely:", error.message);
    if (typeof fileSource === "string" && (fileSource.startsWith("data:") || fileSource.startsWith("http"))) {
      return fileSource;
    }
    return PLACEHOLDER_IMAGES.defaultIssue;
  }
};

export default {
  uploadImage,
  isPrivateOrInternalHost,
};

