import type { Context } from "grammy"
import { Database } from "../database/connection"
import { users } from "../database/schema"
import { eq } from "drizzle-orm"

export class UserService {
  static async getOrCreateUser(ctx: Context) {
    const userId = ctx.from?.id
    const username = ctx.from?.username
    const firstName = ctx.from?.first_name
    const lastName = ctx.from?.last_name

    if (!userId) {
      throw new Error("User ID not found")
    }

    const db = Database.getInstance().getDb()
    
    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.telegramId, userId))
        .limit(1)

      if (existingUser.length === 0) {
        await db.insert(users).values({
          telegramId: userId,
          username: username || null,
          firstName: firstName || null,
          lastName: lastName || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        
        console.log(`New user created: ${userId} (${firstName || username || "Unknown"})`)
        return { id: userId, username, firstName, isNew: true }
      } else {
        const user = existingUser[0]
        if (user.firstName !== firstName || user.username !== username || user.lastName !== lastName) {
          await db
            .update(users)
            .set({
              username: username || null,
              firstName: firstName || null,
              lastName: lastName || null,
              updatedAt: new Date(),
            })
            .where(eq(users.telegramId, userId))
          
          console.log(`User updated: ${userId} (${firstName || username || "Unknown"})`)
        }
        
        return { id: userId, username, firstName, isNew: false }
      }
    } catch (error) {
      console.error("Error in getOrCreateUser:", error)
      return { id: userId, username, firstName, isNew: false }
    }
  }

  static async logUserAction(ctx: Context, action: string) {
    const userId = ctx.from?.id
    const chatId = ctx.chat?.id
    
    console.log(`[${new Date().toISOString()}] User ${userId} in chat ${chatId}: ${action}`)
  }
}