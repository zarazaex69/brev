import { Bot } from "grammy"
import { config } from "./config"
import { registerCommands } from "./commands"
import type { BotContext } from "./types"

const bot = new Bot<BotContext>(config.BOT_TOKEN)

registerCommands(bot)

bot.catch((err) => {
  console.error("Bot error:", err)
})

console.log("Brev bot starting...")
bot.start()