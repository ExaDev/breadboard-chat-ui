import { NodeValue } from "@google-labs/breadboard";
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
	LlmRole,
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
	const [key, setApiKey] = React.useState<BreadboardApiKey | null>(
		null
	);
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
			...[
				{
					role: "model" as const,
					parts: [
						{
							text: ["cat", "petFinder", "helloWorld"][
								Math.floor(Math.random() * 3)
							],
						},
					],
				},
			],
		]);
		setLoading(false);
	};

	const handleOutput = (outputs: Partial<Record<string, NodeValue>>) => {
		const context: NodeValue = outputs.context;
		if (!isLlmContext(context)) {
			console.error(
				"Invalid context",
				outputs.context ? JSON.stringify(outputs.context, null, 2) : "null"
			);
		} else {
			handleLlmResponse(context);
		}
	};

	useEffect(() => {
		if (!query || !url) {
			return;
		}
		// invokeBreadboardForContext({ context: llmContext, boardURL: url, callback: handleLlmResponse });
		invokeBreadboard({
			boardURL: url,
			inputs: { context: llmContext, apiKey: key },
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
