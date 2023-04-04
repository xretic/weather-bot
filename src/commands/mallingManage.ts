import { Command } from "../types/command";

export const execute: Command = {
	name: "malling_manage",
	description: "Включение и выключение рассылки",
	collect: (ctx) => {
		ctx.scene.enter("mallingManage");
	},
};
