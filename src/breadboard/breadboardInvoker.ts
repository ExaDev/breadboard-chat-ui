import { BreadboardUrl, LlmContext } from "./types";

export type BreadboardInvokerCallback = (contextData: LlmContext) => void;

export const invokeBreadboard = async ({
	context,
	boardURL,
	callback,
}: {
	context: LlmContext;
	boardURL: BreadboardUrl;
	callback: BreadboardInvokerCallback;
}) => {
	await sleep(1000);
	callback([
		{
			role: "model",
			parts: [
				{
					text: Math.random() > 0.5 ? "cat" : "helloWorld",
				},
			],
		},
	]);
};

const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));