export type BreadboardUrl = string;
export type BreadboardQueryData = string;
export type BreadboardApiKey = string;
export type LlmContextData = string;
export type LlmContextPart = {
	text: LlmContextData;
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
export type BreadboardResponse = Omit<LlmContextItem, "role"> & { role: "model" };

export type BreadboardContextType = {
	url: BreadboardUrl | null;
	query: BreadboardQuery | null;
	key: BreadboardApiKey | null;
	llmContext: LlmContext;
	setUrl: (url: BreadboardUrl) => void;
	setApiKey: (key: BreadboardApiKey) => void;
	setQuery: (query: BreadboardQueryData) => void;
	componentHandler: <T>(obj: T) => void;
	loading: boolean;
} | null;

export function isLlmContext(context: unknown): context is LlmContext {
	if (!Array.isArray(context)) {
		return false;
	}
	for (const item of context) {
		if (!item.role || !item.parts) {
			return false;
		}
		for (const part of item.parts) {
			if (!part.text) {
				return false;
			}
		}
	}
	return true;
}

export type ComponentHandler<T> = (obj: T) => void;
