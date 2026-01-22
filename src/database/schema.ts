import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  telegramId: integer("telegram_id").notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

export const userTokens = sqliteTable("user_tokens", {
  id: integer("id").primaryKey(),
  telegramId: integer("telegram_id").notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

export const userActions = sqliteTable("user_actions", {
  id: integer("id").primaryKey(),
  telegramId: integer("telegram_id").notNull(),
  action: text("action").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
})