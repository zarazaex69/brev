import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database as BunDatabase } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { config } from "../config.js";
import * as schema from "./schema.js";

export class Database {
  private static instance: Database;
  private db: ReturnType<typeof drizzle> | null = null;
  private sqlite: BunDatabase | null = null;
  private connected = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    try {
      console.log("Connecting to database...");
      console.log("Database URL:", config.DATABASE_URL);

      this.sqlite = new BunDatabase(config.DATABASE_URL);
      this.db = drizzle(this.sqlite, { schema });

      await migrate(this.db, { migrationsFolder: "./drizzle" });

      this.connected = true;
      console.log("[!] Database connected successfully");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    console.log("Disconnecting from database...");

    if (this.sqlite) {
      this.sqlite.close();
      this.sqlite = null;
    }

    this.db = null;
    this.connected = false;
    console.log("[!] Database disconnected");
  }

  isConnected(): boolean {
    return this.connected;
  }

  getDb() {
    if (!this.db) {
      throw new Error("Database not connected");
    }
    return this.db;
  }
}
