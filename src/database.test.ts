import { test, expect } from "bun:test"
import { Database } from "./database/connection.js"

test("database singleton pattern", () => {
  const db1 = Database.getInstance()
  const db2 = Database.getInstance()
  
  expect(db1).toBe(db2)
})

test("database initial state", () => {
  const db = Database.getInstance()
  
  expect(db.isConnected()).toBe(false)
  expect(() => db.getDb()).toThrow("Database not connected")
})
