import { Scenes } from "telegraf";
import { CustomContext } from "../types/context";
import { prisma } from "../common/prisma";

export const start = new Scenes.BaseScene<CustomContext>("start").enter(
	async (ctx) => {
		if (ctx.from) {
			await ctx.reply("*Привет! Я - бот который показывает погоду*", {
				parse_mode: "Markdown",
			});

			await prisma.user.upsert({
				where: {
					userId: ctx.from.id,
				},

				update: {},

				create: {
					userId: ctx.from.id,
				},
			});
		}
	}
);
