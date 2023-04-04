import { CronJob } from "cron";
import { prisma } from "../common/prisma";
import moment from "moment";
import Weather from "../classes/Weather";
import { telegramClient } from "../common/telegram";

const cron = async (): Promise<void> => {
	const options = {
		malling: true,
		city: {
			not: "",
		},
		lastMalling: {
			lt: moment().unix() - 86400,
		},
	};

	const users = await prisma.user.findMany({
		where: options,
	});

	await prisma.user.updateMany({
		where: options,

		data: {
			lastMalling: moment().unix(),
		},
	});

	for (const user of users) {
		const weatherInfo = await Weather.get(user.city);

		await telegramClient.telegram.sendMessage(
			Number(user.userId),
			"🌡 *Погода на сегодня*\n\n" +
				`*Максимальная температура:* \`${weatherInfo[2]}\`\n` +
				`*Минимальная температура:* \`${weatherInfo[1]}\`\n` +
				`*Средняя температура:* \`${weatherInfo[0]}\``,
			{
				parse_mode: "Markdown",
			}
		);
	}
};

export default async function (): Promise<void> {
	new CronJob("* * * * *", cron, null, true, undefined, null, true);
}
