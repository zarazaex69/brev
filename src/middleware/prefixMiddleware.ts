import type { Context, NextFunction } from "grammy"
import { PrefixService } from "../services/prefixService.js"
import { commands } from "../modules/index.js"

export async function prefixMiddleware(ctx: Context, next: NextFunction) {
  const text = ctx.message?.text
  const userId = ctx.from?.id

  if (!text || !userId) {
    return next()
  }

  const parsed = PrefixService.extractCommand(text)
  if (!parsed) {
    return next()
  }

  const { prefix, command, args } = parsed
  const userPrefix = PrefixService.getUserPrefix(userId)

  if (prefix !== userPrefix) {
    return next()
  }

  const commandHandler = commands.find(cmd => cmd.name === command)
  if (!commandHandler) {
    return next()
  }

  try {
    await commandHandler.handler(ctx)
  } catch (error) {
    console.error(`Error executing command ${command}:`, error)
    await ctx.reply("Произошла ошибка при выполнении команды")
  }
}