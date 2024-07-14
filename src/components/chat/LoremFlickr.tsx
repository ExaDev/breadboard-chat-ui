export const Style = {
	Gray: "g",
	Pixelated: "p",
	Red: "red",
	Green: "green",
	Blue: "blue",
} as const;
export type Style = (typeof Style)[keyof typeof Style];

/**
 * @param width - The width of the image
 * @param height - The height of the image
 * @param keywords - The keywords to search for
 * @param style - The style of the image
 * @param all - Whether to search for all keywords
 */
export type LoremFlickrProps = {
	width: number;
	height: number;
	keywords?: string[];
	style?: Style;
	all?: boolean;
};

export const LoremFlickr: React.FC<LoremFlickrProps> = ({
	width,
	height,
	keywords,
	style,
	all,
}: LoremFlickrProps) => {
	const joinedKeywords = keywords?.filter(Boolean).join(",");
	const url = `https://loremflickr.com/${[
		style,
		width,
		height,
		joinedKeywords,
		all ? "all" : "",
	]
		.filter(Boolean)
		.join("/")}`;
	return (
		<img
			src={url}
			alt={`LoremFlickr image with keywords: ${keywords?.join(", ")}`}
			width={width}
			height={height}
		/>
	);
};
