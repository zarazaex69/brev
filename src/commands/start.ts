import type { Command } from "../types";

export const startCommand: Command = {
  name: "start",
  description: "Познакомиться с ботом",
  usage: "/start",
  examples: ["/start"],
  handler: async (ctx) => {
    const firstName = ctx.from?.first_name || "друг";

    const message = `(- ω -) Привет, ${firstName}!

Я Brev - телеграм бот от zarazaex.xyz

[?] Что я умею:
├ Генерировать контент
├ Отвечать на любые вопросы
└ Помогать с администрацией группы

[*] Начни с <code>/help</code> чтобы увидеть все мои команды`;

    await ctx.reply(message, { parse_mode: "HTML" });
  },
};
