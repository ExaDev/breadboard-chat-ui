import React, { PropsWithChildren, useEffect } from "react";
import { invokeBreadboardForContext } from "../breadboardInvoker";
import {
	BreadboardApiKey,
	BreadboardContextType,
	BreadboardQuery,
	BreadboardUrl,
	LlmContext,
	LlmContextItem,
	LlmRole,
} from "../types";
import { useLocalStorage } from "../../hooks/useLocalStorage";

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
					text: Math.random() > 0.5 ? "cat" : "helloWorld"
				}
			]
		}]]);
			setLoading(false);
	};

	useEffect(() => {
		if (!query || !url) {
			return;
		}
		invokeBreadboardForContext({ context: llmContext, boardURL: url, callback: handleLlmResponse });
	}, [query]);

	const setBreaboardUrl = (url: BreadboardUrl) => {
		setUrl(url);
		setStoredValue(url);
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
			}}
		>
			{children}
		</BreadboardContext.Provider>
	);
};
