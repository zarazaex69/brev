import { test, expect, describe, beforeEach } from "bun:test"
import { PrefixService } from "./prefixService.js"

describe("PrefixService", () => {
  beforeEach(() => {
    const service = PrefixService as any
    if (service.userPrefixes) {
      service.userPrefixes.clear()
    }
  })

  describe("getUserPrefix", () => {
    test("returns default prefix for new user", () => {
      const prefix = PrefixService.getUserPrefix(12345)
      expect(prefix).toBe("/")
    })

    test("returns custom prefix after setting", () => {
      PrefixService.setUserPrefix(12345, ".")
      const prefix = PrefixService.getUserPrefix(12345)
      expect(prefix).toBe(".")
    })
  })

  describe("setUserPrefix", () => {
    test("sets prefix for user", () => {
      PrefixService.setUserPrefix(99999, "!")
      expect(PrefixService.getUserPrefix(99999)).toBe("!")
    })

    test("overwrites existing prefix", () => {
      PrefixService.setUserPrefix(11111, "/")
      PrefixService.setUserPrefix(11111, ".")
      expect(PrefixService.getUserPrefix(11111)).toBe(".")
    })
  })

  describe("getAllPrefixes", () => {
    test("returns all available prefixes", () => {
      const prefixes = PrefixService.getAllPrefixes()
      expect(prefixes).toEqual(["/", ".", "!"])
    })

    test("returns array with 3 elements", () => {
      const prefixes = PrefixService.getAllPrefixes()
      expect(prefixes.length).toBe(3)
    })
  })

  describe("isValidPrefix", () => {
    test("returns true for valid prefixes", () => {
      expect(PrefixService.isValidPrefix("/")).toBe(true)
      expect(PrefixService.isValidPrefix(".")).toBe(true)
      expect(PrefixService.isValidPrefix("!")).toBe(true)
    })

    test("returns false for invalid prefixes", () => {
      expect(PrefixService.isValidPrefix("#")).toBe(false)
      expect(PrefixService.isValidPrefix("@")).toBe(false)
      expect(PrefixService.isValidPrefix("")).toBe(false)
    })
  })

  describe("extractCommand", () => {
    test("extracts command with slash prefix", () => {
      const result = PrefixService.extractCommand("/ask hello world")
      expect(result).toEqual({
        prefix: "/",
        command: "ask",
        args: ["hello", "world"]
      })
    })

    test("extracts command with dot prefix", () => {
      const result = PrefixService.extractCommand(".help")
      expect(result).toEqual({
        prefix: ".",
        command: "help",
        args: []
      })
    })

    test("extracts command with exclamation prefix", () => {
      const result = PrefixService.extractCommand("!stat")
      expect(result).toEqual({
        prefix: "!",
        command: "stat",
        args: []
      })
    })

    test("handles command with bot mention", () => {
      const result = PrefixService.extractCommand("/ask@mybot hello")
      expect(result).toEqual({
        prefix: "/",
        command: "ask",
        args: ["hello"]
      })
    })

    test("returns null for text without prefix", () => {
      const result = PrefixService.extractCommand("hello world")
      expect(result).toBe(null)
    })

    test("handles empty command after prefix", () => {
      const result = PrefixService.extractCommand("/ ")
      expect(result?.prefix).toBe("/")
      expect(result?.command).toBe("")
    })

    test("handles multiple spaces in arguments", () => {
      const result = PrefixService.extractCommand("/ask  hello   world")
      expect(result?.args.filter(arg => arg !== "").length).toBeGreaterThanOrEqual(2)
    })
  })

  describe("formatCommand", () => {
    test("formats command with slash prefix", () => {
      const formatted = PrefixService.formatCommand("ask", "/")
      expect(formatted).toBe("/ask")
    })

    test("formats command with dot prefix", () => {
      const formatted = PrefixService.formatCommand("help", ".")
      expect(formatted).toBe(".help")
    })

    test("formats command with exclamation prefix", () => {
      const formatted = PrefixService.formatCommand("stat", "!")
      expect(formatted).toBe("!stat")
    })
  })
})
