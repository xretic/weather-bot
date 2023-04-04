import { Markup, Scenes } from "telegraf";
import { CustomContext } from "../types/context";
import { prisma } from "../common/prisma";

export const mallingManage = new Scenes.BaseScene<CustomContext>(
	"mallingManage"
)
	.enter(async (ctx) => {
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

			await ctx.reply(
				`*Желаете ли вы ${
					user.malling ? "выключить" : "включить"
				} ежедневную рассылку прогноза погоды?*`,
				{
					parse_mode: "Markdown",
					...Markup.inlineKeyboard([
						Markup.button.callback(
							"✅ Подтвердить",
							`confirm:${user.malling ? "off" : "on"}`
						),

						Markup.button.callback("❌ Отменить", "cancel"),
					]),
				}
			);
		}
	})
	.action(new RegExp(/confirm:(.+)/i), async (ctx) => {
		if (ctx.from) {
			const [, actionType] = ctx.match;

			await prisma.user.update({
				where: {
					userId: ctx.from.id,
				},

				data: {
					malling: actionType === "on" ? true : false,
				},
			});

			await ctx.editMessageText(
				"*Вы успешно изменили тип состояния рассылки!*",
				{
					parse_mode: "Markdown",
				}
			);
		}
	})
	.action("cancel", (ctx) => ctx.deleteMessage());
