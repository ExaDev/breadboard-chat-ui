/* eslint-disable @typescript-eslint/no-unused-vars */
import AgentKit from "@google-labs/agent-kit";
import {
	GraphDescriptor,
	InputValues,
	NodeValue,
	OutputValues,
	RunResult,
	asRuntimeKit,
	createDataStore,
	createLoader,
	inflateData,
} from "@google-labs/breadboard";
import {
	HarnessRunResult,
	RunConfig,
	run,
} from "@google-labs/breadboard/harness";
import { AnyRunRequestMessage } from "@google-labs/breadboard/remote";
import Core from "@google-labs/core-kit";
import GeminiKit from "@google-labs/gemini-kit";
import JSONKit from "@google-labs/json-kit";
import TemplateKit from "@google-labs/template-kit";
import { BreadboardUrl, LlmContext, isLlmContext } from "./types";

export type BreadboardInvokerContextCallback = (
	contextData: LlmContext
) => void;

export type Chunk = AnyRunRequestMessage[1];
export const invokeBreadboardForContext = async ({
	context,
	boardURL,
	callback,
}: {
	context: LlmContext;
	boardURL: BreadboardUrl;
	callback: BreadboardInvokerContextCallback;
}) => {
	await invokeBreadboard({
		boardURL,
		inputs: {
			context,
		} satisfies InputValues,
		outputHandler: (outputs) => {
			const context: NodeValue = outputs.context;
			if (!isLlmContext(context)) {
				console.error(
					"Invalid context",
					outputs.context ? JSON.stringify(outputs.context, null, 2) : "null"
				);
			} else {
				callback(context);
			}
		},
	});
};

export type OutputHandler = (
	outputs: Partial<Record<string, NodeValue>>
) => void;

export async function invokeBreadboard({
	boardURL,
	inputs,
	outputHandler,
}: {
	boardURL: string;
	inputs: InputValues;
	outputHandler: OutputHandler;
}) {
	const response = await fetch(boardURL);
	const board = await response.json();

	if (!isBgl(board)) {
		throw new Error(`Invalid board: ${JSON.stringify(board, null, 2)}`);
	}

	const store = createDataStore();
	const runConfig: RunConfig = {
		url: boardURL,
		kits: [
			asRuntimeKit(Core),
			asRuntimeKit(AgentKit),
			asRuntimeKit(TemplateKit),
			asRuntimeKit(JSONKit),
			asRuntimeKit(GeminiKit),
		],
		loader: createLoader(),
		store,
		diagnostics: true,
		// runner,
		interactiveSecrets: false,
	};

	// await runWithRunner({
	// 	runner: runner.run(runConfig),
	// 	inputs,
	// 	outputHandler,
	// });

	// await runWithHarness({
	// 	harness: run(runConfig),
	// 	inputs,
	// 	outputHandler,
	// });

	for await (const result of run(runConfig)) {
		const { type, data, reply }: HarnessRunResult = result;
		if (type === "input") {
			await reply({ inputs });
		} else if (type === "output") {
			console.debug({ output: data.outputs });
			const outputs = await inflateData(store, data.outputs);
			// return inflateData(store, data.outputs);
			outputHandler(outputs as OutputValues);
		} else if (type === "error") {
			console.error({
				error: data.error,
			});
		} else if (type === "end") {
			console.debug({ end: data });
		} else {
			console.warn({ [type]: data });
		}
	}
	// return {
	// $error: "Run completed without signaling end or error.",
	// };
}

async function runWithHarness({
	harness,
	inputs,
	outputHandler,
}: {
	harness: AsyncGenerator<HarnessRunResult, void, unknown>;
	inputs: InputValues;
	outputHandler: OutputHandler;
}): Promise<void> {
	for await (const runResult of harness) {
		console.debug("=".repeat(80));
		console.debug({ [runResult.type]: runResult });
		if (runResult.type === "input") {
			console.log({ inputs });
			// await runResult.reply({
			// 	inputs,
			// } satisfies Chunk);
		} else if (runResult.type === "skip") {
			// skip.data.missingInputs
			console.debug({ missingInputs: runResult.data.missingInputs });
		} else if (runResult.type === "output") {
			console.debug({ output: runResult });
			const outputs: OutputValues = runResult.data.outputs;
			outputHandler(outputs);
		} else {
			//
		}
	}
}

//// @ts-expect-error - This function is not used in this file
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runWithRunner({
	runner,
	inputs,
	outputHandler,
}: {
	runner: AsyncGenerator<RunResult, unknown, unknown>;
	inputs: InputValues;
	outputHandler: OutputHandler;
}): Promise<void> {
	for await (const runResult of runner) {
		console.debug("=".repeat(80));
		console.debug({ [runResult.type]: runResult });

		if (runResult.type === "input") {
			runResult.inputs = inputs;
		} else if (runResult.type === "output") {
			const outputs: OutputValues = runResult.outputs;
			outputHandler(outputs);
		} else {
			//
		}
	}
}

function isBgl(board: unknown): board is GraphDescriptor {
	if (typeof board !== "object" || board === null) {
		console.error("Board is not an object");
		return false;
	}
	if (!("nodes" in board)) {
		console.error("Board does not have nodes");
		return false;
	}
	if (!Array.isArray(board.nodes)) {
		console.error("Board nodes is not an array");
		return false;
	}
	if (!("edges" in board)) {
		console.error("Board does not have edges");
		return false;
	}
	if (!Array.isArray(board.edges)) {
		console.error("Board edges is not an array");
		return false;
	}
	return true;
}
