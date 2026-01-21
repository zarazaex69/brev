import { Bot } from "grammy"
import { config } from "./config.js"
import { commands } from "./modules/index.js"
import { loggingMiddleware } from "./middleware/logging.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { Database } from "./database/connection.js"
import type { BotContext } from "./types.js"

const bot = new Bot<BotContext>(config.BOT_TOKEN)

async function initializeBot() {
  try {
    const db = Database.getInstance()
    await db.connect()

    bot.use(loggingMiddleware)

    commands.forEach(command => {
      bot.command(command.name, command.handler)
    })

    await bot.api.setMyCommands(
      commands.map(cmd => ({
        command: cmd.name,
        description: cmd.description
      }))
    )

    bot.catch(errorHandler)

    console.log("[!] Bot initialized successfully")
    console.log(`[!] Registered ${commands.length} commands`)
    
    await bot.start()
  } catch (error) {
    console.error("Failed to initialize bot:", error)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  console.log("\n[!] Shutting down bot...")
  const db = Database.getInstance()
  await db.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log("\n[!] Shutting down bot...")
  const db = Database.getInstance()
  await db.disconnect()
  process.exit(0)
})

initializeBot()