import type { Context } from "grammy"
import { GrammyError, HttpError } from "grammy"

export async function errorHandler(err: any) {
  const ctx = err.ctx as Context
  const error = err.error

  console.error(`Error while handling update ${ctx.update.update_id}:`)
  
  if (error instanceof GrammyError) {
    console.error("Error in request:", error.description)
  } else if (error instanceof HttpError) {
    console.error("Could not contact Telegram:", error)
  } else {
    console.error("Unknown error:", error)
  }

  try {
    await ctx.reply("Произошла ошибка при обработке команды. Попробуйте позже.")
  } catch (replyError) {
    console.error("Failed to send error message:", replyError)
  }
}