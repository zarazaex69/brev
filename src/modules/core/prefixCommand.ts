import type { Context } from "grammy"
import { InlineKeyboard } from "grammy"
import { PrefixService } from "../../services/prefixService.js"
import { UserService } from "../../services/userService.js"
import type { Command } from "../../types.js"

function createPrefixKeyboard(currentPrefix: string): InlineKeyboard {
  const keyboard = new InlineKeyboard()
  
  const slashText = currentPrefix === "/" ? "+" : "/"
  const dotText = currentPrefix === "." ? "+" : "."
  const exclamationText = currentPrefix === "!" ? "+" : "!"
  
  keyboard
    .text(slashText, "prefix_/")
    .text(dotText, "prefix_.")
    .text(exclamationText, "prefix_!")
    
  return keyboard
}

export const prefixCommand: Command = {
  name: "prefix",
  description: "Выбрать префикс для команд",
  usage: "/prefix",
  examples: ["/prefix"],
  arguments: [],
  handler: async (ctx: Context) => {
    await UserService.logUserAction(ctx, "prefix command")
    
    const userId = ctx.from?.id
    if (!userId) return

    const currentPrefix = PrefixService.getUserPrefix(userId)
    const keyboard = createPrefixKeyboard(currentPrefix)
    
    const message = `[?] Выбери префикс для команд:

Текущий префикс: <code>${currentPrefix}</code>

[*] Примеры использования:
├ ${PrefixService.formatCommand("start", "/")} - стандартный
├ ${PrefixService.formatCommand("start", ".")} - точка  
└ ${PrefixService.formatCommand("start", "!")} - восклицательный

[^] Нажми на кнопку ниже:`

    await ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: keyboard
    })
  }
}

export { createPrefixKeyboard }