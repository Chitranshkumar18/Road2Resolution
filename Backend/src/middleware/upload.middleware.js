import multer from "multer";
import path from "path";
import ApiError from "../utils/ApiError.js";

// Use memory storage for direct Cloudinary streaming or fallback disk storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only image files (.jpg, .jpeg, .png, .webp) are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size
  },
  fileFilter,
});

export const uploadSingle = (fieldName = "image") => upload.single(fieldName);
export const uploadMultiple = (fieldName = "images", maxCount = 5) => upload.array(fieldName, maxCount);

export default upload;
