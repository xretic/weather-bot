import { Command } from "../types/command";

export const execute: Command = {
	name: "view_weather",
	description: "Просмотреть погоду на сегодня",
	collect: (ctx) => {
		ctx.scene.enter("viewWeather");
	},
};
