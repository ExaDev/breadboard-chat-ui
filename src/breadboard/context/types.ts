export type BreadboardUrl = string;
export type BreadboardQueryData = string;
export type LlmContextPart = {
	text: string;
};

export const LlmRole = {
	user: "user",
	model: "model",
} as const;
export type LlmRole = (typeof LlmRole)[keyof typeof LlmRole];
export type LlmContextItem = {
	role: LlmRole;
	parts: LlmContextPart[];
};
export type LlmContext = LlmContextItem[];

export type BreadboardQuery = Omit<LlmContextItem, "role"> & { role: "user" };

export type BreadboardContextType = {
	url: BreadboardUrl | null;
	query: BreadboardQuery | null;
	queryHistory: BreadboardQuery[];
	setUrl: (url: BreadboardUrl) => void;
	setQuery: (query: BreadboardQueryData) => void;
} | null;