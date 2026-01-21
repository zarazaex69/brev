import { z } from "zod"

const ConfigSchema = z.object({
  BOT_TOKEN: z.string().min(1, "BOT_TOKEN is required"),
  DATABASE_URL: z.string().default("./data/bot.db"),
})

function loadConfig() {
  const env = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
  }

  const result = ConfigSchema.safeParse(env)
  
  if (!result.success) {
    console.error("Config validation failed:")
    result.error.errors.forEach(err => {
      console.error(`- ${err.path.join(".")}: ${err.message}`)
    })
    process.exit(1)
  }

  return result.data
}

export const config = loadConfig()