export type BreadboardUrl = string;
export type BreadboardQueryData = string;
export type BreadboardApiKey = string;

export const VideoMimeType = {
	mov: "video/mov",
	mpegVideo: "video/mpeg",
	mp4: "video/mp4",
	mpg: "video/mpg",
	avi: "video/avi",
	wmv: "video/wmv",
	mpegps: "video/mpegps",
	flv: "video/flv",
} as const;
export type VideoMimeType = (typeof VideoMimeType)[keyof typeof VideoMimeType];

export const ImageMimeType = {
	png: "image/png",
	jpeg: "image/jpeg",
} as const;
export type ImageMimeType = (typeof ImageMimeType)[keyof typeof ImageMimeType];
export type ImageDataPart = DataPart<ImageMimeType>;

export const TextMimeType = {
	text: "text/plain",
} as const;
export type TextMimeType = (typeof TextMimeType)[keyof typeof TextMimeType];
export type TextDataPart = DataPart<TextMimeType>;

export const AudioMimeType = {
	mpegAudio: "audio/mpeg",
	mp3: "audio/mp3",
	wav: "audio/wav",
} as const;
export type AudioMimeType = (typeof AudioMimeType)[keyof typeof AudioMimeType];
export type AudioDataPart = DataPart<AudioMimeType>;

export const ApplicationMimeType = {
	applicationPdf: "application/pdf",
} as const;
export type ApplicationMimeType =
	(typeof ApplicationMimeType)[keyof typeof ApplicationMimeType];
export type ApplicationDataPart = DataPart<ApplicationMimeType>;

export const FileMimeType = {
	...TextMimeType,
	...VideoMimeType,
	...ImageMimeType,
	...AudioMimeType,
	...ApplicationMimeType,
} as const;
export type FileMimeType = (typeof FileMimeType)[keyof typeof FileMimeType];

export type StringPart = {
	text: string;
	inlineData?: never;
	fileData?: never;
	videoMetadata?: never;
};

export type InlineDataPart<F extends FileMimeType = FileMimeType> = {
	text?: never;
	fileData?: never;
	inlineData: {
		mimeType: F;
		data: string;
	};
};

export type FileDataPart<F extends FileMimeType = FileMimeType> = {
	text?: never;
	inlineData?: never;
	fileData: {
		mimeType: F;
		fileUri: string;
	};
};

export type VideoStartOffset = {
	startOffset: {
		seconds: number;
		nanos: number;
	};
};

export type VideoEndOffset = {
	endOffset: {
		seconds: number;
		nanos: number;
	};
};

export type VideoMetadataType = {
	videoMetadata?: VideoStartOffset | VideoEndOffset;
};

export const NonVideoMimeType = {
	...TextMimeType,
	...ImageMimeType,
	...AudioMimeType,
	...ApplicationMimeType,
} as const;

export type NonVideoMimeType =
	(typeof NonVideoMimeType)[keyof typeof NonVideoMimeType];

export type DataPart<F extends FileMimeType = FileMimeType> =
	| InlineDataPart<F>
	| FileDataPart<F>;

export type NonVideoDataPart = DataPart<NonVideoMimeType>;
export type VideoDataPart = DataPart<VideoMimeType> & VideoMetadataType;

export type LlmContextPart = StringPart | NonVideoDataPart | VideoDataPart;

export const LlmRole = {
	user: "user",
	model: "model",
} as const;
export type LlmRole = (typeof LlmRole)[keyof typeof LlmRole];

export type LlmContextItem = {
	role?: LlmRole;
	parts: LlmContextPart[];
};

export type LlmContext = LlmContextItem[];

export type BreadboardQuery = Omit<LlmContextItem, "role"> & { role: "user" };
export type BreadboardResponse = Omit<LlmContextItem, "role"> & {
	role: "model";
};

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
