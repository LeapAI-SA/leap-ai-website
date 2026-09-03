import fs from "fs"
import path from "path"
import multer from "multer"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const UPLOAD_DIR = path.resolve(__dirname, "../../uploads")
export const CV_UPLOAD_DIR = path.join(UPLOAD_DIR, "cv")

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}
if (!fs.existsSync(CV_UPLOAD_DIR)) {
  fs.mkdirSync(CV_UPLOAD_DIR, { recursive: true })
}

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
}

const CV_ALLOWED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
}

function startsWith(buf: Buffer, bytes: number[]) {
  if (buf.length < bytes.length) return false
  return bytes.every((b, i) => buf[i] === b)
}

export function matchesImageMagic(filePath: string, mime: string): boolean {
  const fd = fs.openSync(filePath, "r")
  try {
    const buf = Buffer.alloc(16)
    fs.readSync(fd, buf, 0, 16, 0)
    switch (mime) {
      case "image/jpeg":
        return startsWith(buf, [0xff, 0xd8, 0xff])
      case "image/png":
        return startsWith(buf, [0x89, 0x50, 0x4e, 0x47])
      case "image/gif":
        return buf.toString("ascii", 0, 6) === "GIF87a" || buf.toString("ascii", 0, 6) === "GIF89a"
      case "image/webp":
        return buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP"
      default:
        return false
    }
  } finally {
    fs.closeSync(fd)
  }
}

export function matchesCvMagic(filePath: string, mime: string): boolean {
  const fd = fs.openSync(filePath, "r")
  try {
    const buf = Buffer.alloc(8)
    fs.readSync(fd, buf, 0, 8, 0)
    switch (mime) {
      case "application/pdf":
        return buf.toString("ascii", 0, 4) === "%PDF"
      case "application/msword":
        return startsWith(buf, [0xd0, 0xcf, 0x11, 0xe0])
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return startsWith(buf, [0x50, 0x4b]) // ZIP/OOXML
      default:
        return false
    }
  } finally {
    fs.closeSync(fd)
  }
}

export function removeUploadedFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch {
    /* ignore */
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = ALLOWED_MIME[file.mimetype] ?? ".jpg"
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}${ext}`
    cb(null, safe)
  },
})

const cvStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, CV_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = CV_ALLOWED_MIME[file.mimetype] ?? ".pdf"
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}${ext}`
    cb(null, safe)
  },
})

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const expected = ALLOWED_MIME[file.mimetype]
    const ext = path.extname(file.originalname).toLowerCase()
    const okExt = !ext || [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)
    if (expected && okExt) {
      cb(null, true)
    } else {
      cb(new Error("Only JPEG, PNG, GIF, and WebP images are allowed"))
    }
  },
})

export const uploadCv = multer({
  storage: cvStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const expected = CV_ALLOWED_MIME[file.mimetype]
    const ext = path.extname(file.originalname).toLowerCase()
    const okExt = !ext || [".pdf", ".doc", ".docx"].includes(ext)
    if (expected && okExt) {
      cb(null, true)
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"))
    }
  },
})
