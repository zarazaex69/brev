import type { Context } from "grammy"
import { UserService } from "../../services/userService.js"
import type { Command } from "../../types.js"

export const startCommand: Command = {
  name: "start",
  description: "Познакомиться с ботом",
  usage: "/start",
  examples: ["/start"],
  arguments: [],
  handler: async (ctx: Context) => {
    await UserService.logUserAction(ctx, "start command")
    
    const firstName = ctx.from?.first_name || "друг"

    const message = `(- ω -) Привет, ${firstName}!

Я Brev - телеграм бот от zarazaex.xyz

[?] Что я умею:
├ Генерировать контент
├ Отвечать на любые вопросы
└ Помогать с администрацией группы

[*] Начни с <code>/help</code> чтобы увидеть все мои команды`

    await ctx.reply(message, { parse_mode: "HTML" })
  }
}

export const helpCommand: Command = {
  name: "help",
  description: "Список всех команд и функций",
  usage: "/help [команда]",
  arguments: [
    {
      name: "команда",
      description: "Название команды для подробностей",
      required: false,
      example: "start"
    }
  ],
  examples: ["/help", "/help start"],
  handler: async (ctx: Context) => {
    await UserService.logUserAction(ctx, "help command")
    
    const { commands } = await import("../../modules/index.js")
    const args = ctx.message?.text?.split(" ").slice(1) || []
    const targetCommand = args[0]

    if (targetCommand) {
      const command = commands.find((cmd: Command) => cmd.name === targetCommand)
      if (!command) {
        await ctx.reply(
          ` ( 0-0 ) Команда "${targetCommand}" не найдена\n\nИспользуй <code>/help</code> для полного списка`,
          { parse_mode: "HTML" }
        )
        return
      }

      let message = `! Команда: <code>/${command.name}</code>\n`
      message += `[*] ${command.description}\n`

      if (command.usage) {
        message += `\n[?] Как использовать:\n`
        message += `└ <code>${command.usage}</code>\n`
      }

      if (command.arguments && command.arguments.length > 0) {
        message += `\n[*] Параметры:\n`
        command.arguments.forEach((arg: any, index: number) => {
          const required = arg.required
            ? "[+] обязательный"
            : "[-] необязательный"
          const isLast = index === command.arguments!.length - 1
          const connector = isLast ? "└" : "├"
          
          message += `${connector} ${arg.name} (${required})\n`
          message += `│ ${arg.description}\n`
          if (arg.example) {
            message += `${isLast ? "└" : "│"} Пример: <code>${arg.example}</code>\n`
          }
        })
      }

      if (command.examples && command.examples.length > 0) {
        message += `\n[^] Примеры:\n`
        command.examples.forEach((example: string, index: number) => {
          const isLast = index === command.examples!.length - 1
          const connector = isLast ? "└" : "├"
          message += `${connector} <code>${example}</code>\n`
        })
      }

      await ctx.reply(message, { parse_mode: "HTML" })
      return
    }

    let message = `! Мои команды:\n\n`

    commands.forEach((command: Command, index: number) => {
      const number = index + 1
      const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
      const roman = romanNumerals[index] || `${number}`
      
      message += `${roman} - <code>/${command.name}</code>\n`
      message += `├ ${command.description}\n`
      if (command.usage) {
        message += `└ <code>${command.usage}</code>\n`
      } else {
        message += `└ <code>/${command.name}</code>\n`
      }
      message += `\n`
    })

    message += `[*] Для подробностей: <code>/help [команда]</code>\n`
    message += `[^] Например: <code>/help start</code>`

    await ctx.reply(message, { parse_mode: "HTML" })
  }
}