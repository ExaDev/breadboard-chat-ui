import React, { PropsWithChildren, useEffect } from "react";
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
	LlmRole
} from "../types";
import { useIndexedDB } from "./useIndexedDB";

export const BreadboardContext =
	React.createContext<BreadboardContextType>(null);

export const BreadboardProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const [locallyStoredURL, setStoredValue] =
		useLocalStorage<BreadboardUrl | null>("breadboardUrl", null);
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
	// I don't like this but it works for now NEEDS REFACTOR
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
			console.error("Invalid LLM context", context);
			return;
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
				body: {
					contents: llmContext,
				},
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
