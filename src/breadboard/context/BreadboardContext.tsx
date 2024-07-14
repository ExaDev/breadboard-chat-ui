/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren, useEffect } from "react";
import { componentMap } from "../../components/chat/chatResponseMap";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { invokeBreadboard } from "../breadboardInvoker";
import {
	BreadboardApiKey,
	BreadboardContextType,
	BreadboardQuery,
	BreadboardUrl,
	LlmContext,
	LlmContextItem,
	LlmContextItemWithRole,
	LlmRole,
} from "../types";
import {
	defaultSafetySettings,
	makeAgentKitInput,
	QueryBody,
	SystemInstruction,
} from "./makeQueryBody";
import { makeSchema } from "./makeSchema";
export const BreadboardContext =
	React.createContext<BreadboardContextType>(null);

const htmlQueryConfig: Partial<QueryBody> = {
	generation_config: {
		responseMimeType: "text/plain",
	},
	system_instruction: {
		parts: [
			{
				text: [
					"Based on the user's input, create an html element that fulfills the user's request.",
					"The response should be raw html.",
					"Include inline styles and scripts if necessary.",
					"Do not respond with a full html page.",
					"Do not respond with anything other than the html element.",
				].join("\n"),
			},
		],
	} satisfies SystemInstruction,
};

const componentMapQueryConfig: Partial<QueryBody> = {
	generation_config: {
		responseMimeType: "application/json",
	},
	system_instruction: {
		parts: [
			{
				text: [
					"Based on the user's input respond with the name of the most appropriate component.",
					"Include a rationale and a certainty value.",
					"Your response should be an object which conforms to the schema below.",
				].join("\n"),
			},
			{
				text: makeSchema(componentMap),
			},
			{
				text: JSON.stringify(componentMap.getAllDescriptors(), null, 2),
			},
		],
	} satisfies SystemInstruction,
};

export const BreadboardProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const [locallyStoredURL, setStoredBoardUrl] =
		useLocalStorage<BreadboardUrl | null>(
			"breadboardUrl",
			"https://exadev.github.io/boards/chat-ui.bgl.json"
		);
	const [locallyStoredKey, setStoredApiKey] =
		useLocalStorage<BreadboardApiKey | null>("GEMINI_KEY", null);

	const [url, setBoardUrl] = React.useState<BreadboardUrl | null>(
		locallyStoredURL
	);
	const [query, setQuery] = React.useState<BreadboardQuery | null>(null);

	const [key, setApiKey] = React.useState<BreadboardApiKey | null>(
		locallyStoredKey
	);

	const [llmContext, setLlmContext] = React.useState<LlmContext>([]);
	const [loading, setLoading] = React.useState<boolean>(false);

	const addQuery = (newQueryText: string) => {
		setLoading(true);
		const breadboardQuery = {
			role: LlmRole.user,
			parts: [
				{
					text: newQueryText,
				},
			],
		};

		setQuery(breadboardQuery);
		addLlmContextItem(breadboardQuery);
	};

	const addLlmContextItem = (newLlmContextItem: LlmContextItem) => {
		setLlmContext([...llmContext, newLlmContextItem]);
	};

	const handleLlmResponse = (response: LlmContext) => {
		console.log(response);
		setLlmContext([
			...llmContext,
			...response,
			// ...[
			// 	{
			// 		role: "model" as const,
			// 		parts: [
			// 			{
			// 				text: ["cat", "petFinder", "helloWorld"][
			// 					Math.floor(Math.random() * 3)
			// 				],
			// 			},
			// 		],
			// 	},
			// ],
		]);
		setLoading(false);
	};

	const handleOutput = (outputs: unknown) => {
		if (!isLlmRespons(outputs)) {
			console.error("Invalid response", outputs);
			throw new Error("Invalid response")
		}

		const context: LlmContextItemWithRole[] = [
			{
				role: LlmRole.model,
				parts: outputs.context.parts,
			},
		];
		handleLlmResponse(context);
	};

	useEffect(() => {
		if (!query || !url) {
			return;
		}

		invokeBreadboard({
			boardURL: url,
			inputs: makeAgentKitInput({
				context: llmContext,
				responseMimeType: "application/json",
				safetySettings: defaultSafetySettings,
				systemInstruction: {
					parts: [
						{
							text: [
								"Based on the user's input respond with the name of the most appropriate component.",
								"Include a rationale and a certainty value.",
								"Your response should be an object which conforms to the schema below.",
								"Provide parameters for the component if necessary.",
							].join("\n"),
						},
						{
							text: makeSchema(componentMap),
						},
						{
							text: JSON.stringify(componentMap.getAllDescriptors(), null, 2),
						},
					],
				} satisfies SystemInstruction,
			}),
			outputHandler: (outputs) => handleOutput(outputs),
		});
	}, [query]);

	const setBreadboardUrl = (url: BreadboardUrl) => {
		setBoardUrl(url);
		setStoredBoardUrl(url);
	};

	const setBreadboardApiKey = (key: BreadboardApiKey) => {
		setApiKey(key);
		setStoredApiKey(key);
	};

	const handler = <T,>(obj: T) => {
		console.log(obj);
	};

	return (
		<BreadboardContext.Provider
			value={{
				url,
				query,
				setUrl: setBreadboardUrl,
				llmContext,
				setQuery: addQuery,
				loading,
				key,
				setApiKey: setBreadboardApiKey,
				componentHandler: handler,
			}}
		>
			{children}
		</BreadboardContext.Provider>
	);
};

function isLlmContextItem(context: unknown): context is LlmContextItem {
	if (!context) {
		console.error("Context was null", context || "null");
		return false;
	}
	if (typeof context !== "object") {
		console.error("Context was not an object", context);
		return false;
	}
	if (!("parts" in context)) {
		console.error("Context did not have parts", context);
		return false;
	}
	if (!Array.isArray(context.parts)) {
		console.error("Context parts was not an array", context);
		return false;
	}
	if (context.parts.some((part) => typeof part !== "object")) {
		console.error("Context part was not an object", context);
		return false;
	}
	if (context.parts.some((part) => !("text" in part))) {
		console.error("Context part did not have text", context);
		return false;
	}
	if (context.parts.some((part) => typeof part.text !== "string")) {
		console.error("Context part text was not a string", context);
		return false;
	}
	return true;
}

function isLlmRespons(
	outputs: unknown
): outputs is { context: LlmContextItem } {
	if (!outputs) {
		console.error("Output was null", outputs || "null");
		return false;
	}
	if (typeof outputs !== "object") {
		console.error("Output was not an object", outputs);
		return false;
	}
	if (!("context" in outputs)) {
		console.error("Output did not have a context", outputs);
		return false;
	}
	if (!isLlmContextItem(outputs.context)) {
		console.error(
			"Invalid context",
			outputs.context ? JSON.stringify(outputs.context, null, 2) : "null"
		);
		return false;
	}

	return true;
}
