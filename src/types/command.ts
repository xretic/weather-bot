import { CustomContext } from "./context";

export type Command = {
	name: string;
	description: string;
	collect: (ctx: CustomContext) => void | Promise<void>;
};
