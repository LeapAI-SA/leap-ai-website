import "dotenv/config"
import { connectDB } from "./config/db.js"
import { ensureSeeded } from "./ensure-seeded.js"

async function seed() {
  const uri =
    process.env.MONGODB_URI ?? "mongodb://leap:leapsecret@localhost:27017/leapai?authSource=admin"
  await connectDB(uri)
  await ensureSeeded()

  const email = process.env.ADMIN_EMAIL ?? "admin@leapai.ai"
  console.log(`Seed complete. Admin: ${email}`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
