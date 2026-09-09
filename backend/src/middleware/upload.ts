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

const IMAGE_UPLOAD_ERROR =
  "Only raster images are allowed (JPEG, PNG, GIF, WebP, AVIF, BMP, ICO, TIFF, HEIC)"

/** Alias MIME → canonical MIME used for magic-byte checks and stored extension. */
const MIME_ALIASES: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/png": "image/png",
  "image/x-png": "image/png",
  "image/apng": "image/png",
  "image/gif": "image/gif",
  "image/webp": "image/webp",
  "image/x-webp": "image/webp",
  "image/avif": "image/avif",
  "image/bmp": "image/bmp",
  "image/x-bmp": "image/bmp",
  "image/x-ms-bmp": "image/bmp",
  "image/x-icon": "image/x-icon",
  "image/vnd.microsoft.icon": "image/x-icon",
  "image/tiff": "image/tiff",
  "image/heic": "image/heic",
  "image/heif": "image/heif",
}

const CANONICAL_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/bmp": ".bmp",
  "image/x-icon": ".ico",
  "image/tiff": ".tiff",
  "image/heic": ".heic",
  "image/heif": ".heif",
}

const EXT_TO_CANONICAL: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".jpe": "image/jpeg",
  ".jfif": "image/jpeg",
  ".pjpeg": "image/jpeg",
  ".png": "image/png",
  ".apng": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".heic": "image/heic",
  ".heif": "image/heif",
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

function isoBrands(buf: Buffer): string[] {
  if (buf.length < 12 || buf.toString("ascii", 4, 8) !== "ftyp") return []
  const brands: string[] = [buf.toString("ascii", 8, 12)]
  for (let offset = 16; offset + 4 <= buf.length; offset += 4) {
    brands.push(buf.toString("ascii", offset, offset + 4))
  }
  return brands
}

function hasIsoBrand(buf: Buffer, allowed: string[]) {
  return isoBrands(buf).some((brand) => allowed.includes(brand))
}

export function canonicalImageMime(mime: string, originalName = ""): string | null {
  const normalized = mime.toLowerCase().trim()
  const ext = path.extname(originalName).toLowerCase()
  if (normalized === "application/octet-stream" || normalized === "" || normalized === "binary/octet-stream") {
    return EXT_TO_CANONICAL[ext] ?? null
  }
  const canonical = MIME_ALIASES[normalized]
  if (!canonical) return null
  if (ext && !EXT_TO_CANONICAL[ext]) return null
  if (ext && EXT_TO_CANONICAL[ext] !== canonical) return null
  return canonical
}

export function matchesImageMagic(filePath: string, mime: string): boolean {
  const canonical = canonicalImageMime(mime) ?? MIME_ALIASES[mime.toLowerCase().trim()] ?? null
  if (!canonical) return false

  const fd = fs.openSync(filePath, "r")
  try {
    const buf = Buffer.alloc(32)
    fs.readSync(fd, buf, 0, 32, 0)
    switch (canonical) {
      case "image/jpeg":
        return startsWith(buf, [0xff, 0xd8, 0xff])
      case "image/png":
        return startsWith(buf, [0x89, 0x50, 0x4e, 0x47])
      case "image/gif":
        return buf.toString("ascii", 0, 6) === "GIF87a" || buf.toString("ascii", 0, 6) === "GIF89a"
      case "image/webp":
        return buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP"
      case "image/avif":
        return hasIsoBrand(buf, ["avif", "avis"])
      case "image/bmp":
        return buf.toString("ascii", 0, 2) === "BM"
      case "image/x-icon":
        return startsWith(buf, [0x00, 0x00, 0x01, 0x00])
      case "image/tiff":
        return startsWith(buf, [0x49, 0x49, 0x2a, 0x00]) || startsWith(buf, [0x4d, 0x4d, 0x00, 0x2a])
      case "image/heic":
      case "image/heif":
        return hasIsoBrand(buf, ["heic", "heif", "mif1", "heix", "heim", "hevc"])
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
    const ext = CANONICAL_EXT[file.mimetype] ?? ".jpg"
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
    const canonical = canonicalImageMime(file.mimetype, file.originalname)
    if (!canonical) {
      cb(new Error(IMAGE_UPLOAD_ERROR))
      return
    }
    file.mimetype = canonical
    cb(null, true)
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
