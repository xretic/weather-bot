import { Command } from "../types/command";

export const execute: Command = {
	name: "set_city",
	description: "Установить свой город для показа погоды",
	collect: (ctx) => {
		ctx.scene.enter("sendLocation");
	},
};
