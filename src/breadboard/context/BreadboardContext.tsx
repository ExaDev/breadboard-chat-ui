import React, { PropsWithChildren, useEffect } from "react";
import {
	BreadboardContextType,
	BreadboardQuery,
	BreadboardUrl,
	LlmContext,
	LlmContextItem,
	LlmRole,
} from "../types";
import { invokeBreadboard } from "../breadboardInvoker";

export const BreadboardContext =
	React.createContext<BreadboardContextType>(null);

export const BreadboardProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const [url, setUrl] = React.useState<BreadboardUrl | null>(null);
	const [query, setQuery] = React.useState<BreadboardQuery | null>(null);
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
		invokeBreadboard({ context: llmContext, boardURL: url, callback: handleLlmResponse });
	}, [query]);
	return (
		<BreadboardContext.Provider
			value={{ url, query, setUrl, llmContext, setQuery: addQuery, loading }}
		>
			{children}
		</BreadboardContext.Provider>
	);
};
