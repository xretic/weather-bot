import { readdirSync } from "fs";
import path from "path";
import { telegramClient } from "../common/telegram";

export default async (): Promise<void> => {
	const files = readdirSync(path.resolve(__dirname, `../commands/`));

	for (const file of files) {
		const imported = await import(
			path.resolve(__dirname, `../commands/${file}`)
		);

		const { name, description, collect } = imported.execute;

		const commands = await telegramClient.telegram.getMyCommands();

		telegramClient.telegram.setMyCommands([
			...commands,
			{
				command: name,
				description: description,
			},
		]);

		telegramClient.command(name, collect);
	}
};
