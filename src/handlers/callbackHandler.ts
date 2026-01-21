import type { Context } from "grammy"
import { PrefixService } from "../services/prefixService.js"
import { createPrefixKeyboard } from "../modules/core/prefixCommand.js"

export async function handlePrefixCallback(ctx: Context) {
  const callbackData = ctx.callbackQuery?.data
  const userId = ctx.from?.id

  if (!callbackData || !userId) return

  if (!callbackData.startsWith("prefix_")) return

  const newPrefix = callbackData.replace("prefix_", "")
  
  if (!PrefixService.isValidPrefix(newPrefix)) {
    await ctx.answerCallbackQuery("Неверный префикс!")
    return
  }

  PrefixService.setUserPrefix(userId, newPrefix)

  const updatedKeyboard = createPrefixKeyboard(newPrefix)

  const message = `[?] Выбери префикс для команд:

Текущий префикс: <code>${newPrefix}</code>

[*] Примеры использования:
├ ${PrefixService.formatCommand("start", "/")} - стандартный
├ ${PrefixService.formatCommand("start", ".")} - точка  
└ ${PrefixService.formatCommand("start", "!")} - восклицательный

[^] Нажми на кнопку ниже:`

  await ctx.editMessageText(message, { 
    parse_mode: "HTML",
    reply_markup: updatedKeyboard
  })
  
  await ctx.answerCallbackQuery(`Префикс изменен на ${newPrefix}`)
}