import { createClient, type RedisClientType } from "redis"

let client: RedisClientType | null = null

export async function connectRedis(url: string) {
  client = createClient({
    url,
    socket: {
      connectTimeout: 2000,
      reconnectStrategy: () => false,
    },
  })
  client.on("error", () => {})
  await client.connect()
  console.log("Redis connected")
  return client
}

export function getRedis(): RedisClientType | null {
  return client
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!client?.isOpen) return null
  const raw = await client.get(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300) {
  if (!client?.isOpen) return
  await client.set(key, JSON.stringify(value), { EX: ttlSeconds })
}

export async function cacheDel(...keys: string[]) {
  if (!client?.isOpen || keys.length === 0) return
  await client.del(keys)
}
