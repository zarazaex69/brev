import { test, expect } from "bun:test"
import { commands } from "./modules/index.js"

test("all commands have required properties", () => {
  commands.forEach(cmd => {
    expect(cmd.name).toBeDefined()
    expect(cmd.description).toBeDefined()
    expect(typeof cmd.handler).toBe("function")
  })
})

test("commands array is not empty", () => {
  expect(commands.length).toBeGreaterThan(0)
})

test("command names are unique", () => {
  const names = commands.map(cmd => cmd.name)
  const uniqueNames = new Set(names)
  expect(names.length).toBe(uniqueNames.size)
})
