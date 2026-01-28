import type { Command } from "../types.js"
import { startCommand, helpCommand } from "./core/handlers.js"
import { prefixCommand } from "./core/prefixCommand.js"
import { askCommand } from "./core/askCommand.js"
import { handleStatCommand } from "./core/statCommand.js"

const statCommand: Command = {
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

export const commands: Command[] = [
  startCommand,
  helpCommand,
  prefixCommand,
  askCommand,
  statCommand
]