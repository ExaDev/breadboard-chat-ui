import {
	BoardRunner,
	Kit,
	OutputValues,
	asRuntimeKit
} from "@google-labs/breadboard";
import { RunConfig, run } from "@google-labs/breadboard/harness";
import { InputResolveRequest } from "@google-labs/breadboard/remote";
import Core from "@google-labs/core-kit";
import { BreadboardUrl, LlmContext, isLlmContext } from "./types";

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
	const response = await fetch(boardURL);
	const board = await response.json();

	const runner: BoardRunner = await BoardRunner.fromGraphDescriptor(board);

	const runTimeKits: Kit[] = [asRuntimeKit(Core)];

	const runConfig: RunConfig = {
		url: ".",
		kits: runTimeKits,
		remote: undefined,
		proxy: undefined,
		diagnostics: true,
		runner: runner,
	};

	for await (const runResult of run(runConfig)) {
		if (runResult.type === "input") {
			await runResult.reply({
				inputs: {
					context,
				},
			} satisfies InputResolveRequest);
		} else if (runResult.type === "output") {
			const resultOutputs: OutputValues = runResult.data.outputs;
			console.log("output with Kit", JSON.stringify(resultOutputs, null, 2));
			const context = resultOutputs.context;
			if (!isLlmContext(context)) {
				console.error(
					"Invalid context",
					resultOutputs.context
						? JSON.stringify(resultOutputs.context, null, 2)
						: "null"
				);
				continue;
			}
			await callback(context);
		}
	}
};

const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
