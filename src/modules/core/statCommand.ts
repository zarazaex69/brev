import type { BotContext } from "../../types";
import { StatsService } from "../../services/statsService";

const statsService = new StatsService();

export async function handleStatCommand(ctx: BotContext) {
  try {
    const args = ctx.message?.text?.split(" ").slice(1) || [];
    
    let limit = 20;
    
    if (args.length > 0) {
      const parsedLimit = parseInt(args[0]);
      if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 50) {
        limit = parsedLimit;
      }
    }

    const stats = await statsService.getDailyStats(limit);
    const message = statsService.formatStatsMessage(stats, limit);
    
    if (message.length > 4096) {
      const truncatedStats = await statsService.getDailyStats(10);
      const truncatedMessage = statsService.formatStatsMessage(truncatedStats, 10);
      await ctx.reply(truncatedMessage + "\n\n[!] Список сокращен из-за лимита символов", { parse_mode: "HTML" });
      return;
    }

    await ctx.reply(message, { parse_mode: "HTML" });
  } catch (error) {
    console.error("Error in stat command:", error);
    await ctx.reply("( x-x ) Ошибка при получении статистики");
  }
}