import bcrypt from "bcryptjs"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { User } from "./models/User.js"
import { getOrCreateSettings } from "./models/SiteSettings.js"
import { ContentItem } from "./models/ContentItem.js"
import { upsertArticlesFromSeed } from "./lib/upsert-articles.js"

type Localized = { ar: string; en: string }
type SeedItem = {
  slug: string
  title: Localized
  excerpt: Localized
  description: Localized
  features: { ar: string[]; en: string[] }
}
type CaseSeedItem = SeedItem & {
  category: string
  groupTitle: Localized
}
type JobSeedItem = SeedItem & {
  department: string
  groupTitle: Localized
}

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadSeedData() {
  const path = join(__dirname, "data", "content-seed.json")
  return JSON.parse(readFileSync(path, "utf-8")) as {
    solutionsGroups: { slug: string; title: Localized; items: SeedItem[] }[]
    products: SeedItem[]
    useCases: SeedItem[]
    cases?: CaseSeedItem[]
    jobs?: JobSeedItem[]
  }
}

async function importCases(cases: CaseSeedItem[] | undefined) {
  if (!cases?.length) {
    await ContentItem.deleteMany({ type: "case" })
    return
  }
  const existing = await ContentItem.countDocuments({ type: "case" })
  if (existing > 0) return

  let order = 0
  for (const item of cases) {
    await ContentItem.create({
      type: "case",
      slug: item.slug,
      groupSlug: item.category,
      groupTitle: item.groupTitle,
      title: item.title,
      excerpt: item.excerpt,
      description: item.description,
      features: item.features ?? { ar: [], en: [] },
      published: true,
      sortOrder: order++,
    })
  }
  console.log(`Cases seeded: ${cases.length} items`)
}

async function importJobs(jobs: JobSeedItem[] | undefined) {
  if (!jobs?.length) {
    await ContentItem.deleteMany({ type: "job" })
    return
  }
  const existing = await ContentItem.countDocuments({ type: "job" })
  if (existing > 0) return

  let order = 0
  for (const item of jobs) {
    await ContentItem.create({
      type: "job",
      slug: item.slug,
      groupSlug: item.department,
      groupTitle: item.groupTitle,
      title: item.title,
      excerpt: item.excerpt,
      description: item.description,
      features: item.features ?? { ar: [], en: [] },
      published: true,
      sortOrder: order++,
    })
  }
  console.log(`Jobs seeded: ${jobs.length} items`)
}

async function importContent() {
  const count = await ContentItem.countDocuments()
  const { solutionsGroups, products, useCases, cases, jobs } = loadSeedData()

  if (count === 0) {
    let order = 0

    for (const group of solutionsGroups) {
      for (const item of group.items) {
        await ContentItem.create({
          type: "solution",
          slug: item.slug,
          groupSlug: group.slug,
          groupTitle: group.title,
          title: item.title,
          excerpt: item.excerpt,
          description: item.description,
          features: item.features,
          published: true,
          sortOrder: order++,
        })
      }
    }

    order = 0
    for (const item of products) {
      await ContentItem.create({
        type: "product",
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        description: item.description,
        features: item.features,
        published: true,
        sortOrder: order++,
      })
    }

    order = 0
    for (const item of useCases) {
      await ContentItem.create({
        type: "use-case",
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        description: item.description,
        features: item.features,
        published: true,
        sortOrder: order++,
      })
    }

    console.log(`Content seeded: ${await ContentItem.countDocuments()} items`)
  }

  await importCases(cases)
  await importJobs(jobs)
}

export async function ensureSeeded() {
  const email = process.env.ADMIN_EMAIL ?? "admin@leapai.ai"
  const password = process.env.ADMIN_PASSWORD ?? "admin123"

  const existing = await User.findOne({ email })
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12)
    await User.create({ email, passwordHash, role: "admin" })
    console.log(`Admin user created: ${email}`)
  }

  await getOrCreateSettings()
  await importContent()
  await upsertArticlesFromSeed()
}
