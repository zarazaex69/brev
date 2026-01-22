import { createQwen } from "qwen.js"
import { Database } from "../database/connection.js"
import { userTokens } from "../database/schema.js"
import { eq } from "drizzle-orm"

const GLOBAL_TOKEN_ID = 0

export class AuthSetup {
  static async ensureAuthenticated(): Promise<void> {
    const db = Database.getInstance().getDb()
    
    const existingToken = await db
      .select()
      .from(userTokens)
      .where(eq(userTokens.telegramId, GLOBAL_TOKEN_ID))
      .limit(1)

    if (existingToken.length > 0) {
      console.log("[!] Qwen authentication found")
      return
    }

    console.log("\n[!] First time setup - Qwen authentication required")
    console.log("[?] This is a one-time process for all users\n")

    const client = createQwen()
    
    try {
      const { url, userCode } = await client.login()
      
      console.log("[>] Authentication steps:")
      console.log("├─ Step 1: Open this URL in your browser")
      console.log(`│  ${url}`)
      console.log("├─ Step 2: Enter this code")
      console.log(`│  ${userCode}`)
      console.log("└─ Step 3: Waiting for authorization...\n")

      await client.waitForAuth()
      
      const tokens = client.getTokens()
      if (!tokens) {
        throw new Error("Failed to retrieve tokens")
      }

      const now = new Date()
      const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000)

      await db.insert(userTokens).values({
        telegramId: GLOBAL_TOKEN_ID,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
        expiresAt: Math.floor(expiresAt.getTime() / 1000),
        createdAt: now,
        updatedAt: now,
      })

      console.log("[!] Authentication successful")
      console.log("[+] Global token saved\n")
    } catch (error) {
      console.error("\n[*] Authentication failed:", error)
      console.error("[>] Please restart the bot and try again\n")
      process.exit(1)
    }
  }
}