import { Scenes } from "telegraf";
import { CustomContext } from "../types/context";
import Weather from "../classes/Weather";
import { prisma } from "../common/prisma";

export const sendLocation = new Scenes.BaseScene<CustomContext>("sendLocation")
	.enter(async (ctx) => {
		await ctx.reply("*Отправьте в чат название своего города*", {
			parse_mode: "Markdown",
		});
	})
	.on("text", async (ctx) => {
		const city = ctx.message.text;
		const check = await Weather.check(city);

		await ctx.deleteMessage();

		if (!check) {
			await ctx.reply("*Вы указали не существующий город!*", {
				parse_mode: "Markdown",
			});

			ctx.scene.enter("start");

			return;
		}

		await prisma.user.upsert({
			where: {
				userId: ctx.from.id,
			},

			update: {
				city,
			},

			create: {
				userId: ctx.from.id,
				city,
			},
		});

		await ctx.reply("*Вы успешно указали город!*", {
			parse_mode: "Markdown",
		});

		ctx.scene.enter("start");
	});
