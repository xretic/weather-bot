import { Scenes } from "telegraf";
import { CustomContext } from "../types/context";
import { prisma } from "../common/prisma";
import Weather from "../classes/Weather";

export const viewWeather = new Scenes.BaseScene<CustomContext>(
	"viewWeather"
).enter(async (ctx) => {
	if (ctx.from) {
		const user = await prisma.user.upsert({
			where: {
				userId: ctx.from.id,
			},

			update: {},

			create: {
				userId: ctx.from.id,
			},
		});

		if (user.city === "") {
			await ctx.reply("*Вы не установили город проживания!*", {
				parse_mode: "Markdown",
			});

			ctx.scene.enter("start");

			return;
		}

		const weatherInfo = await Weather.get(user.city);

		await ctx.reply(
			"🌡 *Погода на сегодня*\n\n" +
				`*Максимальная температура:* \`${weatherInfo[2]}\`\n` +
				`*Минимальная температура:* \`${weatherInfo[1]}\`\n` +
				`*Средняя температура:* \`${weatherInfo[0]}\``,
			{
				parse_mode: "Markdown",
			}
		);
	}
});
