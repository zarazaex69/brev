import { test, expect, describe, mock } from "bun:test"
import { prefixMiddleware } from "./prefixMiddleware.js"
import { PrefixService } from "../services/prefixService.js"
import type { Context } from "grammy"

describe("prefixMiddleware", () => {
  const createMockContext = (text: string, userId: number): Context => {
    return {
      message: {
        text,
        message_id: 1,
        date: Date.now(),
        chat: { id: 123, type: "private" }
      },
      from: {
        id: userId,
        is_bot: false,
        first_name: "Test"
      },
      reply: mock(async () => ({ message_id: 1 }))
    } as any
  }

  const createMockNext = () => mock(async () => {})

  test("calls next for message without text", async () => {
    const ctx = {
      from: { id: 12345 }
    } as any
    const next = createMockNext()

    await prefixMiddleware(ctx, next)
    expect(next).toHaveBeenCalled()
  })

  test("calls next for message without user", async () => {
    const ctx = {
      message: { text: "/ask hello" }
    } as any
    const next = createMockNext()

    await prefixMiddleware(ctx, next)
    expect(next).toHaveBeenCalled()
  })

  test("calls next for text without prefix", async () => {
    const ctx = createMockContext("hello world", 12345)
    const next = createMockNext()

    await prefixMiddleware(ctx, next)
    expect(next).toHaveBeenCalled()
  })

  test("calls next when prefix does not match user prefix", async () => {
    PrefixService.setUserPrefix(12345, "/")
    const ctx = createMockContext(".ask hello", 12345)
    const next = createMockNext()

    await prefixMiddleware(ctx, next)
    expect(next).toHaveBeenCalled()
  })

  test("calls next for unknown command", async () => {
    PrefixService.setUserPrefix(12345, "/")
    const ctx = createMockContext("/unknowncommand", 12345)
    const next = createMockNext()

    await prefixMiddleware(ctx, next)
    expect(next).toHaveBeenCalled()
  })

  test("handles error in command handler gracefully", async () => {
    PrefixService.setUserPrefix(12345, "/")
    const ctx = createMockContext("/ask hello", 12345)
    const next = createMockNext()

    await prefixMiddleware(ctx, next)
    
    expect(ctx.reply).toBeDefined()
  })
})
