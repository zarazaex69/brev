import type { Context } from "grammy"

interface UserPrefix {
  userId: number
  prefix: string
}

export class PrefixService {
  private static userPrefixes = new Map<number, string>()

  static getUserPrefix(userId: number): string {
    return this.userPrefixes.get(userId) || "/"
  }

  static setUserPrefix(userId: number, prefix: string): void {
    this.userPrefixes.set(userId, prefix)
  }

  static getAllPrefixes(): string[] {
    return ["/", ".", "!"]
  }

  static isValidPrefix(prefix: string): boolean {
    return this.getAllPrefixes().includes(prefix)
  }

  static extractCommand(text: string): { prefix: string; command: string; args: string[] } | null {
    const prefixes = this.getAllPrefixes()
    
    for (const prefix of prefixes) {
      if (text.startsWith(prefix)) {
        const withoutPrefix = text.slice(1)
        const parts = withoutPrefix.split(" ")
        let command = parts[0]
        const args = parts.slice(1)
        
        if (command.includes("@")) {
          command = command.split("@")[0]
        }
        
        return { prefix, command, args }
      }
    }
    
    return null
  }

  static formatCommand(command: string, userPrefix: string): string {
    return `${userPrefix}${command}`
  }
}