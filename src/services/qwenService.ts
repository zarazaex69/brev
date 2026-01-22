import { createQwen, type ChatMessage } from "qwen.js";
import { Database } from "../database/connection.js";
import { userTokens } from "../database/schema.js";
import { eq } from "drizzle-orm";

const GLOBAL_TOKEN_ID = 0;

export class QwenService {
  private static client: ReturnType<typeof createQwen> | null = null;

  static async getOrCreateClient(): Promise<ReturnType<typeof createQwen>> {
    if (this.client) {
      return this.client;
    }

    const db = Database.getInstance().getDb();
    const tokenRecord = await db
      .select()
      .from(userTokens)
      .where(eq(userTokens.telegramId, GLOBAL_TOKEN_ID))
      .limit(1);

    if (tokenRecord.length === 0) {
      throw new Error("AUTH_REQUIRED");
    }

    const token = tokenRecord[0];
    if (!token) {
      throw new Error("AUTH_REQUIRED");
    }

    this.client = createQwen({
      accessToken: token.accessToken,
      refreshToken: token.refreshToken || undefined,
    });

    return this.client;
  }

  static async saveTokens(
    accessToken: string,
    refreshToken?: string,
  ): Promise<void> {
    const db = Database.getInstance().getDb();
    const now = new Date();
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);

    await db
      .insert(userTokens)
      .values({
        telegramId: GLOBAL_TOKEN_ID,
        accessToken,
        refreshToken: refreshToken || null,
        expiresAt: Math.floor(expiresAt.getTime() / 1000),
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: userTokens.telegramId,
        set: {
          accessToken,
          refreshToken: refreshToken || null,
          expiresAt: Math.floor(expiresAt.getTime() / 1000),
          updatedAt: now,
        },
      });
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const db = Database.getInstance().getDb();
      const tokenRecord = await db
        .select()
        .from(userTokens)
        .where(eq(userTokens.telegramId, GLOBAL_TOKEN_ID))
        .limit(1);

      return tokenRecord.length > 0;
    } catch {
      return false;
    }
  }

  static async askQwen(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const client = await this.getOrCreateClient();

      const messages: ChatMessage[] = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      messages.push({ role: "user", content: prompt });

      const options = {
        tools: [
          {
            type: "function",
            function: {
              name: "dummy",
              description: "do not use",
              parameters: {},
            },
          },
        ],
      };

      let result = "";
      for await (const chunk of client.chatStream(messages, options)) {
        result += chunk;
      }

      if (!result || result.trim().length === 0) {
        throw new Error("EMPTY_RESPONSE");
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "AUTH_REQUIRED") {
          throw new Error("AUTH_REQUIRED");
        }
        if (error.message === "EMPTY_RESPONSE") {
          throw new Error("EMPTY_RESPONSE");
        }
      }
      console.error("Qwen service askQwen error:", error);
      throw new Error("API_ERROR");
    }
  }

  static async startAuthentication(): Promise<{
    url: string;
    userCode: string;
  }> {
    try {
      const client = createQwen();
      const authData = await client.login();

      this.client = client;
      return authData;
    } catch (error) {
      console.error("Auth start error:", error);
      throw new Error("AUTH_START_FAILED");
    }
  }

  static async completeAuthentication(): Promise<void> {
    if (!this.client) {
      throw new Error("AUTH_SESSION_NOT_FOUND");
    }

    try {
      await this.client.waitForAuth();
      const tokens = this.client.getTokens();

      if (!tokens) {
        throw new Error("TOKEN_RETRIEVAL_FAILED");
      }

      await this.saveTokens(tokens.accessToken, tokens.refreshToken);
    } catch (error) {
      this.client = null;

      if (error instanceof Error) {
        if (error.message === "TOKEN_RETRIEVAL_FAILED") {
          throw error;
        }
      }
      throw new Error("AUTH_COMPLETION_FAILED");
    }
  }

  static clearClient(): void {
    this.client = null;
  }
}
