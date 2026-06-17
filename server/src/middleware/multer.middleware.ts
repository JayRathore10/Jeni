import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

// Optional: limit allowed file types
const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  // Accept all files
  cb(null, true);

  // Example to only allow images:
  // if (file.mimetype.startsWith("image/")) {
  //   cb(null, true);
  // } else {
  //   cb(new Error("Only image files are allowed"));
  // }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});