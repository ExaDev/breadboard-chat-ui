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
	parts: {
		text: string;
	}[];
};

export type SafetySetting = {
	category: HarmCategory;
	threshold: SafetyThreshold;
};

export type GeneratorConfig = {
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
	safety_settings?: SafetySetting[];
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

export type QueryBody = {
	contents: LlmContext;
	safety_settings?: SafetySetting[];
	generation_config?: GeneratorConfig;
	system_instruction?: SystemInstruction;
};

/**
 * @documentation https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#request
 */
export function makeQueryBody({
	contents,
	system_instruction,
	safety_settings = defaultSafetySettings,
	generation_config = defaultGeneratorConfig,
}: QueryBody): ContextPayload {
	return {
		contents,
		safety_settings,
		generation_config,
		system_instruction,
	};
}

export type AgentKitInput =
	| {
			text: string;
			context?: never;
	  }
	| {
			context: LlmContext;
			text?: never;
	  };

export type AgentKitParams = {
	responseMimeType?: ResponseType;
	model?: GeminiModel;
	retry?: `${number}`;
	safetySettings?: SafetySetting[];
	stopSequences?: string[];
	systemInstruction?: SystemInstruction;
	tools?: string[];
	useStreaming?: "on" | "off";
} & AgentKitInput;

export const GeminiModel = {
	flash: "gemini-1.5-flash-latest",
} as const;
export type GeminiModel = (typeof GeminiModel)[keyof typeof GeminiModel];

export function makeAgentKitInput({
	responseMimeType,
	model = GeminiModel.flash,
	retry = "0",
	context,
	safetySettings = defaultSafetySettings,
	stopSequences,
	systemInstruction,
	text,
	tools,
	useStreaming,
}: Partial<AgentKitParams> & AgentKitInput) {
	return {
		responseMimeType,
		model,
		retry,
		context,
		safetySettings,
		stopSequences,
		systemInstruction,
		text,
		tools,
		useStreaming,
	};
}
