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
	isLlmContext,
	LlmContext,
	LlmContextItem,
	LlmRole,
} from "../types";
import { makeQueryBody, QueryBody, SystemInstruction } from "./makeQueryBody";
import { makeSchema } from "./makeSchema";
import { useIndexedDB } from "./useIndexedDB";
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
	const [locallyStoredURL, setStoredValue] =
		useLocalStorage<BreadboardUrl | null>(
			"breadboardUrl",
			"https://exadev.github.io/boards/chat-ui.bgl.json"
		);
	const [locallyStoredKey, setStoredKey] =
		useIndexedDB<BreadboardApiKey | null>({
			dbName: "settings",
			objectStoreName: "Secrets",
			name: "GEMINI_KEY",
			initialValue: null,
		});

	const [url, setUrl] = React.useState<BreadboardUrl | null>(locallyStoredURL);
	const [query, setQuery] = React.useState<BreadboardQuery | null>(null);
	// locallyStoredKey is assigned asynchronously so we need to use useEffect to set the key
	const [key, setApiKey] = React.useState<BreadboardApiKey | null>(null);
	// TODO @jamesjacko: I don't like this but it works for now NEEDS REFACTOR
	useEffect(() => {
		if (locallyStoredKey) {
			setApiKey(locallyStoredKey);
		}
	}, [locallyStoredKey]);
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
		// outputs.response.candidates[0].content.parts[0].text
		if (!outputs) {
			console.error("No outputs");
			return;
		}
		if (typeof outputs != "object") {
			console.error("Invalid outputs", outputs);
			return;
		}
		if (!("response" in outputs)) {
			console.error("No response in outputs", outputs);
			return;
		}
		if (typeof outputs.response != "object" || outputs.response === null) {
			console.error("Invalid response", outputs.response);
			return;
		}
		if (!("candidates" in outputs.response)) {
			console.error("No candidates in response", outputs.response);
			return;
		}
		if (!Array.isArray(outputs.response.candidates)) {
			console.error("Candidates is not an array", outputs.response.candidates);
			return;
		}
		if (outputs.response.candidates.length === 0) {
			console.error("No candidates in response", outputs.response.candidates);
			return;
		}

		const context: LlmContext = outputs.response.candidates.map(
			(candidate: { content: { parts: { text: string }[] } }) => ({
				role: "model",
				parts: candidate.content.parts.map((part) => ({
					text: part.text,
				})),
			})
		);

		if (!isLlmContext(context)) {
			console.warn("Context might not be valid", context);
			// return;
		}

		handleLlmResponse(context);
	};

	useEffect(() => {
		if (!query || !url) {
			return;
		}

		invokeBreadboard({
			boardURL: url,
			inputs: {
				body: makeQueryBody({
					contents: llmContext,
					// ...htmlQueryConfig,
					...componentMapQueryConfig,
				}),
				apiKey: key,
			},
			outputHandler: (outputs) => {
				handleOutput(outputs);
			},
		});
	}, [query]);

	const setBreadboardUrl = (url: BreadboardUrl) => {
		setUrl(url);
		setStoredValue(url);
	};

	const setBreadboardApiKey = (key: BreadboardApiKey) => {
		setApiKey(key);
		setStoredKey(key);
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
