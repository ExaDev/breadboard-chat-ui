import React, { PropsWithChildren, useEffect } from "react";
import { BreadboardContextType, BreadboardQuery, BreadboardUrl, LlmRole } from "./types";

export const BreadboardContext =
	React.createContext<BreadboardContextType>(null);

export const BreadboardProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const [url, setUrl] = React.useState<BreadboardUrl | null>(null);
	const [query, setQuery] = React.useState<BreadboardQuery | null>(null);
	const [queryHistory, setQueryHistory] = React.useState<BreadboardQuery[]>([]);

	const addQuery = (newQueryText: string) => {
		const breadboardQuery = {
			role: LlmRole.user,
			parts: [
				{
					text: newQueryText,
				},
			],
		};

		setQuery(breadboardQuery);
		setQueryHistory([...queryHistory, breadboardQuery]);
	};

	useEffect(() => {
		console.log("Query history:", query);
	}, [query]);

	return (
		<BreadboardContext.Provider
			value={{ url, query, setUrl, queryHistory, setQuery: addQuery }}
		>
			{children}
		</BreadboardContext.Provider>
	);
};