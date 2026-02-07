import { Database } from "./database/connection.js"
import { unlink } from "fs/promises"

export async function setupTestDatabase(testDbPath: string) {
  const originalUrl = process.env.DATABASE_URL
  process.env.DATABASE_URL = testDbPath
  
  const db = Database.getInstance()
  
  if (db.isConnected()) {
    await db.disconnect()
  }
  
  try {
    await unlink(testDbPath)
  } catch {}
  
  await db.connect()
  
  return { db, originalUrl }
}

export async function teardownTestDatabase(testDbPath: string, originalUrl?: string) {
  const db = Database.getInstance()
  
  if (db.isConnected()) {
    await db.disconnect()
  }
  
  try {
    await unlink(testDbPath)
  } catch {}
  
  if (originalUrl) {
    process.env.DATABASE_URL = originalUrl
  }
}
