import type { Context, NextFunction } from "grammy"

export async function loggingMiddleware(ctx: Context, next: NextFunction) {
  const start = Date.now()
  const userId = ctx.from?.id
  const chatId = ctx.chat?.id
  const messageText = ctx.message?.text || ctx.callbackQuery?.data || "unknown"
  
  console.log(`[IN] User ${userId} in chat ${chatId}: ${messageText}`)
  
  try {
    await next()
    const duration = Date.now() - start
    console.log(`[OUT] Processed in ${duration}ms`)
  } catch (error) {
    const duration = Date.now() - start
    console.error(`[ERROR] Failed after ${duration}ms:`, error)
    throw error
  }
}