export type BreadboardUrl = string;
export type BreadboardQueryData = string;
export type BreadboardApiKey = string;

export const VideoMimeType = {
	videoMov: "video/mov",
	videoMpeg: "video/mpeg",
	videoMp4: "video/mp4",
	videoMpg: "video/mpg",
	videoAvi: "video/avi",
	videoWmv: "video/wmv",
	videoMpegps: "video/mpegps",
	videoFlv: "video/flv",
} as const;
export type VideoMimeType = (typeof VideoMimeType)[keyof typeof VideoMimeType];

export const ImageMimeType = {
	imagePng: "image/png",
	imageJpeg: "image/jpeg",
	textPlain: "text/plain",
} as const;
export type ImageMimeType = (typeof ImageMimeType)[keyof typeof ImageMimeType];

export const AudioMimeType = {
	audioMpeg: "audio/mpeg",
	audioMp3: "audio/mp3",
	audioWav: "audio/wav",
} as const;
export type AudioMimeType = (typeof AudioMimeType)[keyof typeof AudioMimeType];

export const ApplicationMimeType = {
	applicationPdf: "application/pdf",
} as const;
export type ApplicationMimeType =
	(typeof ApplicationMimeType)[keyof typeof ApplicationMimeType];

export const FileMimeType = {
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

export type VideoMetadataType = {
	videoMetadata?: {
		startOffset?: {
			seconds: number;
			nanos: number;
		};
		endOffset?: {
			seconds: number;
			nanos: number;
		};
	};
};

export const NonVideoMimeType = {
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
	role: LlmRole;
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
