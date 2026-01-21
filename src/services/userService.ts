import type { Context } from "grammy"

export class UserService {
  static async getOrCreateUser(ctx: Context) {
    const userId = ctx.from?.id
    const username = ctx.from?.username
    const firstName = ctx.from?.first_name

    if (!userId) {
      throw new Error("User ID not found")
    }

    console.log(`User interaction: ${userId} (${username || firstName || "Unknown"})`)
    
    return {
      id: userId,
      username,
      firstName,
      isNew: false
    }
  }

  static async logUserAction(ctx: Context, action: string) {
    const userId = ctx.from?.id
    const chatId = ctx.chat?.id
    
    console.log(`[${new Date().toISOString()}] User ${userId} in chat ${chatId}: ${action}`)
  }
}