import {
	BoardRunner,
	GraphDescriptor,
	InlineDataCapabilityPart,
	InputValues,
	Kit,
	NodeValue,
	OutputValues,
	SerializedDataStoreGroup,
	StoredDataCapabilityPart,
	asRuntimeKit,
} from "@google-labs/breadboard";
import { RunConfig, run } from "@google-labs/breadboard/harness";
import { AnyRunRequestMessage } from "@google-labs/breadboard/remote";
import Core from "@google-labs/core-kit";
import { BreadboardUrl, LlmContext, isLlmContext } from "./types";
import AgentKit from "@google-labs/agent-kit";
import TemplateKit from "@google-labs/template-kit";
import JSONKit from "@google-labs/json-kit";
import GeminiKit from "@google-labs/gemini-kit";

export type BreadboardInvokerContextCallback = (
	contextData: LlmContext
) => void;

type Chunk = AnyRunRequestMessage[1];
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
		outputHandler: (ouutputs) => {
			const context: NodeValue = ouutputs.context;
			if (!isLlmContext(context)) {
				console.error(
					"Invalid context",
					ouutputs.context ? JSON.stringify(ouutputs.context, null, 2) : "null"
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
	boardURL: URL | string;
	inputs: InputValues;
	outputHandler: OutputHandler;
}): Promise<void> {
	const response = await fetch(boardURL);
	const board = await response.json();

	if (!isBgl(board)) {
		throw new Error(`Invalid board: ${JSON.stringify(board, null, 2)}`);
	}

	const runner: BoardRunner = await BoardRunner.fromGraphDescriptor(board);

	const runTimeKits: Kit[] = [
		asRuntimeKit(Core),
		asRuntimeKit(AgentKit),
		asRuntimeKit(TemplateKit),
		asRuntimeKit(JSONKit),
		asRuntimeKit(GeminiKit),
	];

	const runConfig: RunConfig = {
		url: ".",
		kits: runTimeKits,
		remote: undefined,
		proxy: undefined,
		diagnostics: true,
		runner: runner,
		interactiveSecrets: false,
	};

	for await (const runResult of run(runConfig)) {
		console.debug("=".repeat(80));
		console.debug({ runResult });
		console.error({
			type: runResult.type,
		});
		if (runResult.type === "input") {
			await runResult.reply({
				inputs,
			} satisfies Chunk);
		} else if (runResult.type === "output") {
			const outputs: OutputValues = runResult.data.outputs;
			console.debug({ type: "outputs", outputs });
			outputHandler(outputs);
		} else {
			console.debug({ runResult });
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
