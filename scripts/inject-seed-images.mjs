import { readFileSync, writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedPath = join(__dirname, "../backend/src/data/content-seed.json")
const seed = JSON.parse(readFileSync(seedPath, "utf-8"))

function imageFor(slug) {
  return `/pages/${slug}.png`
}

for (const group of seed.solutionsGroups) {
  for (const item of group.items) {
    item.image = imageFor(item.slug)
  }
}

for (const item of seed.products) {
  item.image = imageFor(item.slug)
}

for (const item of seed.useCases) {
  item.image = imageFor(item.slug)
}

writeFileSync(seedPath, `${JSON.stringify(seed, null, 2)}\n`, "utf-8")
console.log("Added image paths to content-seed.json")
