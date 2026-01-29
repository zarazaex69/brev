import { Bot } from "grammy"
import { config } from "./config.js"
import { commands } from "./modules/index.js"
import { loggingMiddleware } from "./middleware/logging.js"
import { messageLoggerMiddleware } from "./middleware/messageLogger.js"
import { prefixMiddleware } from "./middleware/prefixMiddleware.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { Database } from "./database/connection.js"
import { handlePrefixCallback } from "./handlers/callbackHandler.js"
import { AuthSetup } from "./services/authSetup.js"
import type { BotContext } from "./types.js"

const bot = new Bot<BotContext>(config.BOT_TOKEN)

async function setupMiddleware() {
  bot.use(loggingMiddleware)
  bot.use(messageLoggerMiddleware)
  bot.on("message:text", prefixMiddleware)
  bot.on("callback_query", handlePrefixCallback)
  bot.catch(errorHandler)
}

async function registerCommands() {
  await bot.api.setMyCommands(
    commands.map(cmd => ({
      command: cmd.name,
      description: cmd.description,
    }))
  )
}

async function initializeBot() {
  try {
    const db = Database.getInstance()
    await db.connect()
    await AuthSetup.ensureAuthenticated()
    
    await setupMiddleware()
    await registerCommands()

    console.log("[!] Bot initialized successfully")
    console.log(`[!] Registered ${commands.length} commands`)

    await bot.start()
  } catch (error) {
    console.error("Failed to initialize bot:", error)
    process.exit(1)
  }
}

async function gracefulShutdown() {
  console.log("\n[!] Shutting down bot...")
  const db = Database.getInstance()
  await db.disconnect()
  process.exit(0)
}

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

initializeBot()
