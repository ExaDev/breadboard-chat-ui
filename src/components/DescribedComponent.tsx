import { z, ZodType } from "zod";
import zodToJsonSchema, { JsonSchema7Type } from "zod-to-json-schema";
import { LoremFlickr } from "./chat/LoremFlickr";

////////////////////////////////////////////////////////////////////////////////

// export type ComponentDescriptor<Z extends ZodType> = {
// 	name: string;
// 	description: string;
// 	propsSchema: Z;
// 	element: React.FC<z.infer<Z>>;
// };

export type ComponentDescriptor<Z extends ZodType> = {
	name: string;
	description: string;
	propsSchema: Z;
	element: React.FC<z.infer<Z>>;
};

// export class ComponentDescriptor<Z extends ZodType>
// 	implements ComponentDescriptorProps<Z>
// {
// 	name: string;
// 	description: string;
// 	propsSchema: Z;
// 	element: React.FC<z.infer<Z>>;

// 	constructor({
// 		name,
// 		description,
// 		propsSchema,
// 		element,
// 	}: {
// 		name: string;
// 		description: string;
// 		propsSchema: Z;
// 		element: React.FC<z.infer<Z>>;
// 	}) {
// 		this.name = name;
// 		this.description = description;
// 		this.propsSchema = propsSchema;
// 		this.element = element;
// 	}
// 	toJsonSchema(): JsonSchema7Type {
// 		return zodToJsonSchema(this.propsSchema);
// 	}
// }
export type ComponentJsonSchemaDescriptor<Z extends ZodType> = {
	name: string;
	description: string;
	propsSchema: JsonSchema7Type;
	element: React.FC<z.infer<Z>>;
};

////////////////////////////////////////////////////////////////////////////////

export type Descriptor<Z extends ZodType> = Omit<
	ComponentDescriptor<Z>,
	"element"
>;

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

export class DescribedComponentMap {
	private static instance: DescribedComponentMap;
	readonly components = new Map<string, ComponentDescriptor<ZodType>>();

	static getInstance() {
		if (!DescribedComponentMap.instance) {
			DescribedComponentMap.instance = new DescribedComponentMap();
		}
		return DescribedComponentMap.instance;
	}

	set<Z extends ZodType>(component: ComponentDescriptor<Z>): this {
		this.components.set(component.name, component);
		return this;
	}
	static set<Z extends ZodType>(
		component: ComponentDescriptor<Z>
	): DescribedComponentMap {
		DescribedComponentMap.getInstance().set(component);
		return DescribedComponentMap.instance;
	}
	has(name: string): boolean {
		return this.components.has(name);
	}
	static has(name: string): boolean {
		return DescribedComponentMap.getInstance().has
			? DescribedComponentMap.getInstance().has(name)
			: false;
	}

	add<Z extends ZodType>({
		name,
		description,
		propsSchema,
		element,
	}: ComponentDescriptor<Z>): this {
		if (this.has(name)) {
			throw new Error(`Component already exists: ${name}`);
		}
		// return this.set({ name, description, propsSchema, element });
		return this.set({ name, description, propsSchema, element });
	}
	static add<Z extends ZodType>({
		name,
		description,
		propsSchema,
		element,
	}: ComponentDescriptor<Z>): DescribedComponentMap {
		return DescribedComponentMap.getInstance().add({
			name,
			description,
			propsSchema,
			element,
		});
	}

	get<Z extends ZodType>(name: string): ComponentDescriptor<Z> {
		const component = this.components.get(name);
		if (!component) {
			throw new Error(`Component not found: ${name}`);
		}
		return component as ComponentDescriptor<Z>;
		// component.element = (props) => {
		// 	component.propsSchema.parse(props);
		// 	return component.element(props);
		// };
		// return component as ComponentDescriptor<Z>;
	}
	static get<Z extends ZodType>(name: string): ComponentDescriptor<Z> {
		return DescribedComponentMap.getInstance().get(name);
	}

	getAll(): ComponentDescriptor<ZodType>[] {
		return Array.from(this.components.values());
	}
	static getAll(): ComponentDescriptor<ZodType>[] {
		return DescribedComponentMap.getInstance().getAll();
	}

	getAllDescriptors(): Descriptor<ZodType>[] {
		return this.getAll().map((component) => ({
			name: component.name,
			description: component.description,
			propsSchema: component.propsSchema,
		}));
	}
	static getAllDescriptors(): Descriptor<ZodType>[] {
		return DescribedComponentMap.getInstance().getAllDescriptors();
	}

	getNameAndDescription(name: string): { name: string; description: string } {
		const component = this.get(name);
		return {
			name: component.name,
			description: component.description,
		};
	}
	static getNameAndDescription(name: string): {
		name: string;
		description: string;
	} {
		return DescribedComponentMap.getInstance().getNameAndDescription(name);
	}

	getAllNamesAndDescriptions(): { name: string; description: string }[] {
		return this.getAll().map((component) => ({
			name: component.name,
			description: component.description,
		}));
	}
	static getAllNamesAndDescriptions(): { name: string; description: string }[] {
		return DescribedComponentMap.getInstance().getAllNamesAndDescriptions
			? DescribedComponentMap.getInstance().getAllNamesAndDescriptions()
			: [];
	}

	getJsonSchema(
		name: string
	): JsonSchema7Type & { $schema?: string; definitions?: object } {
		const component = this.get(name);
		return zodToJsonSchema(component.propsSchema);
	}
	static getJsonSchema(
		name: string
	): JsonSchema7Type & { $schema?: string; definitions?: object } {
		return DescribedComponentMap.getInstance().getJsonSchema(name);
	}

	getJsonSchemaDescriptor(
		name: string
	): ComponentJsonSchemaDescriptor<ZodType> {
		const component = this.get(name);
		return {
			name: component.name,
			description: component.description,
			propsSchema: this.getJsonSchema(name),
			element: component.element,
		};
	}
	static getJsonSchemaDescriptor(
		name: string
	): ComponentJsonSchemaDescriptor<ZodType> {
		return DescribedComponentMap.getInstance().getJsonSchemaDescriptor(name);
	}

	getAllJsonSchemaDesciptors(): ComponentJsonSchemaDescriptor<ZodType>[] {
		return this.getAll().map((component) => ({
			name: component.name,
			description: component.description,
			propsSchema: this.getJsonSchema(component.name),
			element: component.element,
		}));
	}
	static getAllJsonSchemaDesciptors(): ComponentJsonSchemaDescriptor<ZodType>[] {
		return DescribedComponentMap.getInstance().getAllJsonSchemaDesciptors();
	}

	getNames(): string[] {
		return Array.from(this.components.keys());
	}
	static getNames(): string[] {
		return DescribedComponentMap.getInstance().getNames();
	}

	getDescriptor(name: string): Descriptor<ZodType> {
		const component = this.get(name);
		return {
			name: component.name,
			description: component.description,
			propsSchema: component.propsSchema,
		};
	}
	static getDescriptor(name: string): Descriptor<ZodType> {
		return DescribedComponentMap.getInstance().getDescriptor(name);
	}

	getSchema(name: string): ZodType {
		return this.get(name).propsSchema;
	}
	static getSchema(name: string): ZodType {
		return DescribedComponentMap.getInstance().getSchema(name);
	}

	getAllSchemas(): Descriptor<ZodType>[] {
		return this.getAll().map((component) => ({
			name: component.name,
			description: component.description,
			propsSchema: component.propsSchema,
		}));
	}
	static getAllSchemas(): Descriptor<ZodType>[] {
		return DescribedComponentMap.getInstance().getAllSchemas();
	}

	validate(name: string, props: unknown) {
		const schema = this.getSchema(name);
		const result = schema.safeParse(props);
		if (!result.success) {
			throw new Error(result.error.errors.join("\n"));
		}
		return result.data;
	}
	static validate(name: string, props: unknown) {
		return DescribedComponentMap.getInstance().validate(name, props);
	}
}

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

const describedComponentMap = DescribedComponentMap.getInstance();
describedComponentMap
	.set({
		name: "Output",
		description: "A simple output element",
		propsSchema: z.object({
			text: z.string(),
		}),
		element: (props) => <output>{props.text}</output>,
	})
	.set({
		name: "Blockquote",
		description: "A simple blockquote element",
		propsSchema: z.object({
			text: z.string(),
		}),
		element: (props) => <blockquote>{props.text}</blockquote>,
	})
	.add({
		name: "Input",
		description: "A simple input element",
		propsSchema: z.object({
			type: z.string().optional(),
			value: z.string().optional(),
			placeholder: z.string().optional(),
		}),
		element: (props) => <input {...props} />,
	})
	.add({
		name: "String Input",
		description: "A simple string input element",
		propsSchema: z.object({
			value: z.string().optional(),
			placeholder: z.string().optional(),
		}),
		element: (props) => <input type="text" {...props} />,
	})
	.add({
		name: "Number Input",
		description: "A simple number input element",
		propsSchema: z.object({
			value: z.number().optional(),
			placeholder: z.string().optional(),
		}),
		element: (props) => <input type="number" {...props} />,
	})
	.add({
		name: "Checkbox",
		description: "A simple checkbox element",
		propsSchema: z.object({
			checked: z.boolean().optional(),
		}),
		element: (props) => <input type="checkbox" {...props} />,
	})
	.add({
		name: "Radio",
		description: "A simple radio element",
		propsSchema: z.object({
			checked: z.boolean().optional(),
		}),
		element: (props) => <input type="radio" {...props} />,
	})
	.add({
		name: "Select",
		description: "A simple select element",
		propsSchema: z.object({
			value: z.string().optional(),
		}),
		element: (props) => <select {...props} />,
	})
	.add({
		name: "Textarea",
		description: "A simple textarea element",
		propsSchema: z.object({
			value: z.string().optional(),
		}),
		element: (props) => <textarea {...props} />,
	})
	// more complicated elements
	.add({
		name: "Captioned Image",
		description: "An image with a caption",
		propsSchema: z.object({
			src: z.string(),
			alt: z.string(),
			caption: z.string(),
		}),
		element: (props) => {
			const { src, alt, caption } = props;
			return (
				<figure>
					<img src={src} alt={alt} />
					<figcaption>{caption}</figcaption>
				</figure>
			);
		},
	})
	.add({
		name: "List",
		description: "A list of items",
		propsSchema: z.object({
			items: z.array(z.string()),
		}),
		element: (props) => {
			const { items } = props;
			return (
				<ul>
					{items.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
			);
		},
	})
	.add({
		name: "Table",
		description: "A table of rows and columns",
		propsSchema: z.object({
			rows: z.array(z.array(z.string())),
		}),
		element: (props) => {
			const { rows } = props;
			return (
				<table>
					<tbody>
						{rows.map((row, rowIndex) => (
							<tr key={rowIndex}>
								{row.map((cell, cellIndex) => (
									<td key={cellIndex}>{cell}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			);
		},
	})
	.add({
		name: "Lorem Flickr",
		description: "An image from LoremFlickr",
		propsSchema: z.object({
			width: z.number(),
			height: z.number(),
			keywords: z.array(z.string()).optional(),
			style: z
				.union([
					z.literal("g"),
					z.literal("p"),
					z.literal("red"),
					z.literal("green"),
					z.literal("blue"),
				])
				.optional(),
			all: z.boolean().optional(),
		}),
		element: (props) => <LoremFlickr {...props} />,
	})
	.add({
		name: "Canvas",
		description: "A simple canvas element with a script that can be run with a button. Any elements rendered by the script must be within the canvas. Include logic to compute the correct size and locations",
		propsSchema: z.object({
			width: z.number(),
			height: z.number(),
			id: z.string(),
			script: z.string()
		}),
		element: ({
			width,
			height,
			id,
			script,
		}: {
			width: number;
			height: number;
			id?: string;
			script?: string;
		}) => {
			return (
				<div>
					<canvas width={width} height={height} id={id} />
					<button
						onClick={() => {
							if (script) {
								eval(script);
							}
						}}
					>
						Render
					</button>
				</div>
			);
		},
	});
export const ComponentMap = describedComponentMap;
