export type BreadboardUrl = string;
export type BreadboardQuery = string;

export type BreadboardContextType = {
	url: BreadboardUrl | null;
	query: BreadboardQuery | null;
	setUrl: (url: BreadboardUrl) => void;
	setQuery: (query: BreadboardQuery) => void;
} | null;