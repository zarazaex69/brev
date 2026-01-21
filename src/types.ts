import { Bot, Context } from "grammy"

export type BotContext = Context
export type BotInstance = Bot<BotContext>

export interface CommandArgument {
  name: string
  description: string
  required: boolean
  example?: string
}

export interface Command {
  name: string
  description: string
  usage?: string
  arguments?: CommandArgument[]
  examples?: string[]
  handler: (ctx: BotContext) => Promise<void>
}