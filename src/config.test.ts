import { test, expect } from "bun:test"

test("config validation with valid env", () => {
  const originalEnv = process.env.BOT_TOKEN
  process.env.BOT_TOKEN = "test_token"
  
  delete require.cache[require.resolve("./config.js")]
  const { config } = require("./config.js")
  
  expect(config.BOT_TOKEN).toBe("test_token")
  expect(config.DATABASE_URL).toBe("./data/bot.db")
  
  process.env.BOT_TOKEN = originalEnv
})

test("config validation fails without BOT_TOKEN", () => {
  const originalEnv = process.env.BOT_TOKEN
  delete process.env.BOT_TOKEN
  
  const originalExit = process.exit
  const originalError = console.error
  
  let exitCalled = false
  process.exit = (() => { exitCalled = true }) as any
  console.error = () => {}
  
  delete require.cache[require.resolve("./config.js")]
  require("./config.js")
  
  expect(exitCalled).toBe(true)
  
  process.exit = originalExit
  console.error = originalError
  process.env.BOT_TOKEN = originalEnv
})
