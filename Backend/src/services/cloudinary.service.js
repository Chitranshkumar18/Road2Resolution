import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { PLACEHOLDER_IMAGES } from "../utils/constants.js";

/**
 * Uploads an image buffer, base64 string, or remote URL to Cloudinary
 * @param {Buffer|string} fileSource Image buffer, base64 data string, or URL
 * @param {string} folder Cloudinary storage folder (default: 'civicvision/issues')
 */
export const uploadImage = async (fileSource, folder = "civicvision/issues") => {
  if (!fileSource) return null;

  // If Cloudinary credentials are not configured, return base64 or placeholder gracefully
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
    console.warn("Cloudinary upload failed, falling back:", error.message);
    if (typeof fileSource === "string") return fileSource;
    return PLACEHOLDER_IMAGES.defaultIssue;
  }
};

export default {
  uploadImage,
};
