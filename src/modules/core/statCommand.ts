import type { BotContext, Command } from "../../types.js"
import { StatsService } from "../../services/statsService.js"

const statsService = new StatsService()

async function handleStatCommand(ctx: BotContext) {
  try {
    const args = ctx.message?.text?.split(" ").slice(1) || []
    
    let limit = 20
    
    if (args.length > 0 && args[0]) {
      const parsedLimit = parseInt(args[0])
      if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 50) {
        limit = parsedLimit
      }
    }

    const stats = await statsService.getDailyStats(limit)
    let message = statsService.formatStatsMessage(stats, limit)
    
    if (message.length > 4096) {
      const truncatedStats = await statsService.getDailyStats(10)
      message = statsService.formatStatsMessage(truncatedStats, 10) + "\n\n[!] Список сокращен из-за лимита символов"
    }

    await ctx.reply(message, { parse_mode: "HTML" })
  } catch (error) {
    console.error("Error in stat command:", error)
    await ctx.reply("( x-x ) Ошибка при получении статистики")
  }
}

export const statCommand: Command = {
  name: "stat",
  description: "Статистика сообщений за день",
  usage: "/stat [количество]",
  examples: ["/stat", "/stat 30"],
  arguments: [
    {
      name: "количество",
      description: "Количество участников в топе (по умолчанию 20, максимум 50)",
      required: false,
      example: "30"
    }
  ],
  handler: handleStatCommand
}