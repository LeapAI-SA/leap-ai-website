#!/usr/bin/env node
/**
 * Rotate the IndexNow key file and update default key references in source.
 *
 * Usage (from frontend/):
 *   node scripts/rotate-indexnow-key.mjs --key=<bing-generated-key>
 *
 * Get the key from: Bing Webmaster Tools → URL Submission → IndexNow → Generate.
 * Keeps the previous public/{oldKey}.txt in place until you delete it after Bing accepts.
 *
 * Also supports env-only rotation without editing source:
 *   INDEXNOW_KEY=<key> (and deploy public/{key}.txt yourself)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const frontendRoot = join(__dirname, "..")
const indexNowTs = join(frontendRoot, "lib", "indexnow.ts")

const keyArg = process.argv.find((a) => a.startsWith("--key="))?.slice("--key=".length)?.trim()
const key = keyArg || process.env.INDEXNOW_KEY?.trim()

function usage(msg) {
  if (msg) console.error(msg)
  console.error("Usage: node scripts/rotate-indexnow-key.mjs --key=<8-128 hex/alnum/dash chars>")
  process.exit(1)
}

if (!key) usage("Missing --key=")
if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  usage("Key must be 8–128 characters: letters, numbers, dashes only (IndexNow rules).")
}

const indexNowSrc = readFileSync(indexNowTs, "utf8")
const currentMatch = indexNowSrc.match(/\|\|\s*"([A-Za-z0-9-]{8,128})"/)
const oldKey = currentMatch?.[1]
if (!oldKey) {
  console.error("Could not detect current default key in lib/indexnow.ts")
  process.exit(1)
}
if (oldKey === key) {
  console.log(`Key unchanged (${key}). Ensuring public/${key}.txt exists…`)
}

const keyPath = join(frontendRoot, "public", `${key}.txt`)
// Exact bytes — no trailing newline (Bing can be strict)
writeFileSync(keyPath, key, { encoding: "utf8" })
console.log(`Wrote ${keyPath} (${Buffer.byteLength(key, "utf8")} bytes)`)

const filesToPatch = [
  indexNowTs,
  join(frontendRoot, "scripts", "submit-indexnow.mjs"),
  join(frontendRoot, "scripts", "prepare-webmaster-submission.mjs"),
]

let patched = 0
for (const file of filesToPatch) {
  if (!existsSync(file)) continue
  const before = readFileSync(file, "utf8")
  if (!before.includes(oldKey)) continue
  const after = before.split(oldKey).join(key)
  if (after !== before) {
    writeFileSync(file, after, "utf8")
    patched += 1
    console.log(`Updated default key in ${file}`)
  }
}

console.log(`\nPatched ${patched} file(s). Previous key file public/${oldKey}.txt left in place.`)
console.log("Next: deploy frontend, then GEO → Submit sitemap (IndexNow).")
console.log(`Public URL: https://leapai.ai/${key}.txt`)
console.log("Optional: set INDEXNOW_KEY in production env to the same value.")
