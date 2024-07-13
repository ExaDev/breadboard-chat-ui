import { LlmContext } from "../types";

export const SafetyThreshold = {
	blockNone: "BLOCK_NONE",
	blockOnlyHigh: "BLOCK_ONLY_HIGH",
	blockMediumAndAbove: "BLOCK_MEDIUM_AND_ABOVE",
	blockLowAndAbove: "BLOCK_LOW_AND_ABOVE",
} as const;
export type SafetyThreshold =
	(typeof SafetyThreshold)[keyof typeof SafetyThreshold];

export const HarmCategory = {
	harassment: "HARM_CATEGORY_HARASSMENT",
	hateSpeech: "HARM_CATEGORY_HATE_SPEECH",
	sexuallyExplicit: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
	dangerousContent: "HARM_CATEGORY_DANGEROUS_CONTENT",
} as const;
export type HarmCategory = (typeof HarmCategory)[keyof typeof HarmCategory];

export const ResponseType = {
	applicationJson: "application/json",
	textPlain: "text/plain",
} as const;
export type ResponseType = (typeof ResponseType)[keyof typeof ResponseType];

export type SystemInstruction = {
	parts: [
		{
			text: string;
		}
	];
};

type SafetySetting = {
	category: HarmCategory;
	threshold: SafetyThreshold;
};

type GeneratorConfig = {
	responseMimeType?: ResponseType;
	temperature?: number;
	topP?: number;
	topK?: number;
	candidateCount?: number;
	maxOutputTokens?: number;
	stopSequences?: string[];
};

export type ContextPayload = {
	contents: LlmContext;
	safetySettings?: SafetySetting[];
	system_instruction?: SystemInstruction;
	generation_config?: GeneratorConfig;
};

const defaultSafetySettings = [
	{
		category: HarmCategory.harassment,
		threshold: SafetyThreshold.blockNone,
	},
	{
		category: HarmCategory.hateSpeech,
		threshold: SafetyThreshold.blockNone,
	},
	{
		category: HarmCategory.sexuallyExplicit,
		threshold: SafetyThreshold.blockNone,
	},
	{
		category: HarmCategory.dangerousContent,
		threshold: SafetyThreshold.blockNone,
	},
];
const defaultGeneratorConfig = {
	responseMimeType: ResponseType.textPlain,
};
export function makeQueryBody({
	contents,
	safetySettings = defaultSafetySettings,
	generation_config = defaultGeneratorConfig,
}: {
	contents: LlmContext;
	safetySettings?: SafetySetting[];
	generation_config?: GeneratorConfig;
}): ContextPayload {
	return {
		contents: contents,
		safetySettings,
		generation_config,
	};
}
