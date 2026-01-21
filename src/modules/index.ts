import type { Command } from "../types.js"
import { startCommand, helpCommand } from "./core/handlers.js"

export const commands: Command[] = [
  startCommand,
  helpCommand
]