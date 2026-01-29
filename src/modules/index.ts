import type { Command } from "../types.js"
import { startCommand, helpCommand } from "./core/handlers.js"
import { prefixCommand } from "./core/prefixCommand.js"
import { askCommand } from "./core/askCommand.js"
import { statCommand } from "./core/statCommand.js"

export const commands: Command[] = [
  startCommand,
  helpCommand,
  prefixCommand,
  askCommand,
  statCommand
]