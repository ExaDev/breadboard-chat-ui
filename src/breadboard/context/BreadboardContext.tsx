import React, { PropsWithChildren } from "react";
import { BreadboardContextType, BreadboardQuery, BreadboardUrl } from "./types";

export const BreadboardContext = React.createContext<BreadboardContextType>(null);

export const BreadboardProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [url, setUrl] = React.useState<BreadboardUrl | null>(null);
	const [query, setQuery] = React.useState<BreadboardQuery | null>(null);
	const [queryHistory, setQueryHistory] = React.useState<BreadboardQuery[]>([]);

	const addQuery = (query: string) => {
		setQuery(query);
		setQueryHistory([...queryHistory, query]);
	}

	return (
		<BreadboardContext.Provider
			value={{ url, query, setUrl, queryHistory, setQuery: addQuery }}
		>
			{children}
		</BreadboardContext.Provider>
	);
}