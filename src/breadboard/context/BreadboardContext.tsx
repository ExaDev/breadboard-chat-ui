import React, { PropsWithChildren, useEffect } from "react";
import { invokeBreadboard, invokeBreadboardForContext } from "../breadboardInvoker";
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
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { NodeValue } from "@google-labs/breadboard";

export const BreadboardContext =
	React.createContext<BreadboardContextType>(null);

export const BreadboardProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const [locallyStoredURL, setStoredValue] = useLocalStorage<BreadboardUrl | null>("breadboardUrl", null);
	const [url, setUrl] = React.useState<BreadboardUrl | null>(locallyStoredURL);
	const [query, setQuery] = React.useState<BreadboardQuery | null>(null);
	const [key, setApiKey] = React.useState<BreadboardApiKey | null>(null);
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
			setLlmContext([...llmContext, ...[{
			role: "model" as const,
			parts: [
				{
					text: ["cat", "petFinder", "helloWorld"][Math.floor(Math.random() * 3)]
				}
			]
		}]]);
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
	}

	useEffect(() => {
		if (!query || !url) {
			return;
		}
		// invokeBreadboardForContext({ context: llmContext, boardURL: url, callback: handleLlmResponse });
		invokeBreadboard({
			boardURL: url,
			inputs: { context: llmContext ,apiKey:key},
			outputHandler: (outputs) => {
				handleOutput(outputs);
				
			},
		});
	}, [query]);

	const setBreaboardUrl = (url: BreadboardUrl) => {
		setUrl(url);
		setStoredValue(url);
	}

	const handler = <T,>(obj: T) => {
		console.log(obj);
	}
	return (
		<BreadboardContext.Provider
			value={{
				url,
				query,
				setUrl: setBreaboardUrl,
				llmContext,
				setQuery: addQuery,
				loading,
				key,
				setApiKey,
				componentHandler: handler,
			}}
		>
			{children}
		</BreadboardContext.Provider>
	);
};


