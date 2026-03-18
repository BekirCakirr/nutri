import multer from "multer";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = crypto.randomBytes(12).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Desteklenmeyen dosya tipi. Sadece JPEG, PNG, WebP, GIF ve PDF yuklenebilir."));
  }
}

/** Image upload — max 10 MB. */
export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

/** General file upload — max 25 MB. */
export const uploadFile = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});
