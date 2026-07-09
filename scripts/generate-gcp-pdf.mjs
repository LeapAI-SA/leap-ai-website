/**
 * Generates docs/GCP-Deployment-Guide.pdf from the markdown source.
 * Usage: node scripts/generate-gcp-pdf.mjs
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import PDFDocument from "pdfkit"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const mdPath = path.join(root, "docs", "GCP-Deployment-Guide.md")
const pdfPath = path.join(root, "docs", "GCP-Deployment-Guide.pdf")

const md = fs.readFileSync(mdPath, "utf8")

const doc = new PDFDocument({
  margin: 50,
  size: "A4",
  info: {
    Title: "LeapAI Website — GCP Deployment Guide",
    Author: "LeapAI",
    Subject: "Google Cloud Platform deployment instructions",
  },
})

doc.pipe(fs.createWriteStream(pdfPath))

const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

function ensureSpace(lines = 2) {
  const remaining = doc.page.height - doc.page.margins.bottom - doc.y
  if (remaining < lines * 16) doc.addPage()
}

function writeHeading(text, size) {
  ensureSpace(3)
  doc.moveDown(0.4)
  doc.font("Helvetica-Bold").fontSize(size).fillColor("#0066b2").text(text, { width: pageWidth })
  doc.moveDown(0.3)
  doc.fillColor("#000000")
}

function writeParagraph(text, options = {}) {
  ensureSpace(2)
  doc.font(options.mono ? "Courier" : "Helvetica").fontSize(options.size ?? 10)
  doc.text(text, { width: pageWidth, lineGap: 2 })
  doc.moveDown(0.2)
}

function writeCodeBlock(code) {
  ensureSpace(4)
  doc.font("Courier").fontSize(8.5).fillColor("#1a1a1a")
  doc.text(code, { width: pageWidth, lineGap: 1 })
  doc.fillColor("#000000")
  doc.moveDown(0.4)
}

const lines = md.split(/\r?\n/)
let inCode = false
let codeBuffer = []
let tableBuffer = []

function flushTable() {
  if (!tableBuffer.length) return
  writeParagraph(tableBuffer.join("\n"), { mono: true, size: 9 })
  tableBuffer = []
}

for (const line of lines) {
  if (line.startsWith("```")) {
    if (inCode) {
      writeCodeBlock(codeBuffer.join("\n"))
      codeBuffer = []
      inCode = false
    } else {
      flushTable()
      inCode = true
    }
    continue
  }

  if (inCode) {
    codeBuffer.push(line)
    continue
  }

  if (line.startsWith("|")) {
    tableBuffer.push(line)
    continue
  }
  flushTable()

  if (line.startsWith("# ")) {
    writeHeading(line.slice(2).trim(), 18)
    continue
  }
  if (line.startsWith("## ")) {
    writeHeading(line.slice(3).trim(), 14)
    continue
  }
  if (line.startsWith("### ")) {
    writeHeading(line.slice(4).trim(), 12)
    continue
  }
  if (line.startsWith("---")) {
    ensureSpace(1)
    doc.moveDown(0.2)
    doc.strokeColor("#cccccc").moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke()
    doc.moveDown(0.4)
    continue
  }
  if (line.startsWith("- [ ]")) {
    writeParagraph("☐ " + line.slice(5).trim(), { size: 10 })
    continue
  }
  if (line.startsWith("- ")) {
    writeParagraph("• " + line.slice(2).trim(), { size: 10 })
    continue
  }
  if (line.startsWith("> ")) {
    writeParagraph(line.slice(2).trim(), { size: 9 })
    continue
  }
  if (!line.trim()) {
    doc.moveDown(0.15)
    continue
  }
  writeParagraph(line.trim(), { size: 10 })
}

flushTable()
doc.end()

doc.on("finish", () => {
  console.log("PDF created:", pdfPath)
})
