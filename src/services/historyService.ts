import { Database } from "../database/connection.js"
import { history } from "../database/schema.js"
import { and, eq } from "drizzle-orm"

export type HistoryMessage = {
  role: "user" | "assistant"
  content: string
}

export class HistoryService {
  static async getHistory(
    telegramId: number,
    limit = 20,
  ): Promise<HistoryMessage[]> {
    const db = Database.getInstance().getDb()
    const results = await db
      .select({
        role: history.role,
        content: history.content,
      })
      .from(history)
      .where(eq(history.telegramId, telegramId))
      .orderBy(history.createdAt)
      .limit(limit)

    return results as HistoryMessage[]
  }

  static async addMessage(
    telegramId: number,
    message: HistoryMessage,
  ): Promise<void> {
    const db = Database.getInstance().getDb()
    await db.insert(history).values({
      telegramId,
      role: message.role,
      content: message.content,
      createdAt: new Date(),
    })
  }

  static async clearHistory(telegramId: number): Promise<void> {
    const db = Database.getInstance().getDb()
    await db.delete(history).where(eq(history.telegramId, telegramId))
  }
}
