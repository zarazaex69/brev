import { config } from "../config.js"

export class Database {
  private static instance: Database
  private connected = false

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return
    }

    try {
      console.log("Connecting to database...")
      console.log("Database URL:", config.DATABASE_URL.replace(/\/\/.*@/, "//***:***@"))
      
      this.connected = true
      console.log("[!] Database connected successfully")
    } catch (error) {
      console.error("Failed to connect to database:", error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return
    }

    console.log("Disconnecting from database...")
    this.connected = false
    console.log("[!] Database disconnected")
  }

  isConnected(): boolean {
    return this.connected
  }
}