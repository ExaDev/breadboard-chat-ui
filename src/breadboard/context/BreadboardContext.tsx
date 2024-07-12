import React, { PropsWithChildren, useEffect } from "react";
import { BreadboardContextType, BreadboardQuery, BreadboardUrl, LlmContext, LlmContextItem, LlmRole } from "./types";

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
	}
	const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	useEffect(() => {
		if (!query) {
			return;
		}
		const breadboardResponse = {
			role: LlmRole.model,
			parts: [
				{
					text: "Hello from the model",
				},
			],
		};
		addLlmContextItem(breadboardResponse);
		sleep(1000).then(() => {
			setLoading(false);
		});
	}, [query]);
	return (
		<BreadboardContext.Provider
			value={{ url, query, setUrl, llmContext, setQuery: addQuery, loading }}
		>
			{children}
		</BreadboardContext.Provider>
	);
};