import type { BotContext } from "../types";
import { HistoryService } from "../services/historyService";
import { UserService } from "../services/userService";
import { NextFunction } from "grammy";

export async function messageLoggerMiddleware(ctx: BotContext, next: NextFunction) {
  if (ctx.message?.text && ctx.from?.id) {
    const telegramId = ctx.from.id;
    const content = ctx.message.text;
    
    try {
      await UserService.getOrCreateUser(ctx);
      
      await HistoryService.addMessage(telegramId, {
        role: "user",
        content: content,
      });
    } catch (error) {
      console.error("Failed to log message:", error);
    }
  }
  
  await next();
}