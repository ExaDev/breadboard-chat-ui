import {
	BoardRunner,
	GraphDescriptor,
	InputValues,
	Kit,
	NodeValue,
	OutputValues,
	asRuntimeKit,
} from "@google-labs/breadboard";
import { RunConfig, run } from "@google-labs/breadboard/harness";
import { AnyRunRequestMessage } from "@google-labs/breadboard/remote";
import Core from "@google-labs/core-kit";
import { BreadboardUrl, LlmContext, isLlmContext } from "./types";

export type BreadboardInvokerCallback = (contextData: LlmContext) => void;

type Chunk = AnyRunRequestMessage[1];
export const invokeBreadboard = async ({
	context,
	boardURL = "https://exadev.github.io/boards/test.bgl.json", //for testing
	callback,
}: {
	context: LlmContext;
	boardURL: BreadboardUrl;
	callback: BreadboardInvokerCallback;
}) => {
	const response = await fetch(boardURL);
	const board = await response.json();

	if (!isBgl(board)) {
		throw new Error(`Invalid board: ${JSON.stringify(board, null, 2)}`);
	}

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
		console.debug("=".repeat(80));
		console.debug({ runResult });
		if (runResult.type === "input") {
			const inputs: InputValues = {
				context,
			};
			const chunk: Chunk = {
				inputs,
			};
			await runResult.reply(chunk);
		} else if (runResult.type === "output") {
			const outputs: OutputValues = runResult.data.outputs;
			console.debug({ outputs });
			const context: NodeValue = outputs.context;
			if (!isLlmContext(context)) {
				console.error(
					"Invalid context",
					outputs.context ? JSON.stringify(outputs.context, null, 2) : "null"
				);
				continue;
			}
			callback(context);
		}
	}
};

const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

function isBgl(board: unknown): board is GraphDescriptor {
	if (typeof board !== "object" || board === null) {
		console.error("Board is not an object")
		return false;
	}
	if (!("nodes" in board)) {
		console.error("Board does not have nodes")
		return false;
	}
	if (!Array.isArray(board.nodes)) {
		console.error("Board nodes is not an array")
		return false;
	}
	if (!("edges" in board)) {
		console.error("Board does not have edges")
		return false;
	}
	if (!Array.isArray(board.edges)) {
		console.error("Board edges is not an array")
		return false;
	}
	return true;
}
