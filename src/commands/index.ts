import type { BotInstance } from "../types"
import { startCommand } from "./start"
import { helpCommand } from "./help"

export const commands = [
  startCommand,
  helpCommand,
]

export function registerCommands(bot: BotInstance) {
  commands.forEach(cmd => {
    bot.command(cmd.name, cmd.handler)
  })

  const commandList = commands.map(cmd => ({
    command: cmd.name,
    description: cmd.description
  }))

  bot.api.setMyCommands(commandList).catch(err => {
    console.error("Failed to set bot commands:", err)
  })
}