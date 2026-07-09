import mongoose from "mongoose"
import type { MongoMemoryServer } from "mongodb-memory-server"

let memoryServer: MongoMemoryServer | null = null

export async function connectDB(uri: string) {
  mongoose.set("strictQuery", true)

  let connectionUri = uri
  if (process.env.USE_MEMORY_DB === "true") {
    const { MongoMemoryServer } = await import("mongodb-memory-server")
    memoryServer = await MongoMemoryServer.create()
    connectionUri = memoryServer.getUri()
    console.log("Using in-memory MongoDB (USE_MEMORY_DB=true)")
  }

  await mongoose.connect(connectionUri)
  console.log("MongoDB connected")

  if (memoryServer) {
    process.on("SIGINT", async () => {
      await mongoose.disconnect()
      await memoryServer?.stop()
      process.exit(0)
    })
  }
}
