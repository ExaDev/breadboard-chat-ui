import React, { PropsWithChildren } from "react";
import { BreadboardContextType } from "./types";

export const BreadboardContext = React.createContext<BreadboardContextType>(null);

export const BreadboardProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [url, setUrl] = React.useState<string | null>(null);
	const [query, setQuery] = React.useState<string | null>(null);

	return (
		<BreadboardContext.Provider value={{ url, query, setUrl, setQuery }}>
			{children}
		</BreadboardContext.Provider>
	);
}