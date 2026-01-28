import { Database } from "../database/connection";
import { history, users } from "../database/schema";
import { eq, gte, and, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

interface UserStats {
  telegramId: number;
  username: string | null;
  firstName: string | null;
  messageCount: number;
}

export class StatsService {
  private getDayStart(): Date {
    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(22, 0, 0, 0);
    
    if (now.getHours() < 22) {
      dayStart.setDate(dayStart.getDate() - 1);
    }
    
    return dayStart;
  }

  async getDailyStats(limit: number = 20): Promise<UserStats[]> {
    const db = Database.getInstance().getDb();
    const dayStart = this.getDayStart();
    
    const stats = await db
      .select({
        telegramId: history.telegramId,
        username: users.username,
        firstName: users.firstName,
        messageCount: sql<number>`count(*)`.as("messageCount"),
      })
      .from(history)
      .leftJoin(users, eq(history.telegramId, users.telegramId))
      .where(
        and(
          eq(history.role, "user"),
          gte(history.createdAt, dayStart)
        )
      )
      .groupBy(history.telegramId, users.username, users.firstName)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);

    return stats;
  }

  formatStatsMessage(stats: UserStats[], limit: number): string {
    if (stats.length === 0) {
      return `( 0-0 ) <b>Статистика за сегодня пуста</b>

Никто еще не писал сообщений!`;
    }

    let message = `! <b> Статистика сообщений за сегодня</b> \n\n`;

    stats.forEach((stat, index) => {
      const position = index + 1;
      let name: string;
      
      if (stat.firstName) {
        name = `<a href="tg://user?id=${stat.telegramId}">${stat.firstName}</a>`;
      } else if (stat.username) {
        name = `<a href="tg://user?id=${stat.telegramId}">@${stat.username}</a>`;
      } else {
        name = `<a href="tg://user?id=${stat.telegramId}">User ${stat.telegramId}</a>`;
      }
      
      const count = stat.messageCount;
      const plural = count === 1 ? "сообщение" : count < 5 ? "сообщения" : "сообщений";
      
      const isLast = index === stats.length - 1;
      const connector = isLast ? "└" : "├";
      
      if (position <= 3) {
        const medals = ["I", "II", "III"];
        message += `${connector} ${medals[index]} - ${name} (<code>${count}</code> ${plural})\n`;
      } else {
        message += `${connector} ${position} - ${name} (<code>${count}</code> ${plural})\n`;
      }
    });

    const resetTime = new Date();
    resetTime.setHours(22, 0, 0, 0);
    if (resetTime <= new Date()) {
      resetTime.setDate(resetTime.getDate() + 1);
    }

    message += `\n[*] Сброс статистики: ${resetTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
    
    if (limit !== 20) {
      message += `\n[^] Показано топ-${limit}`;
    }

    return message;
  }
}