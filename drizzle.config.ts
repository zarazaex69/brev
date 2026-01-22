import type { Config } from "drizzle-kit"

export default {
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./data/bot.db",
  },
} satisfies Config