import { BreadboardUrl, LlmContext } from "./context/types";

export type BreadboardInvokerCallback = (contextData: LlmContext) => LlmContext;

export const invokeBreadboard = async (context: LlmContext, boardURL: BreadboardUrl, callback: BreadboardInvokerCallback) => {
	await sleep(1000);
	callback([
		...context,
		{
			role: "model",
			parts: [
				{
					text: "Hello, I am a user."
				}
			]
		}
	]);
}

const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));