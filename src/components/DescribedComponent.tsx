import { z, ZodType } from "zod";

////////////////////////////////////////////////////////////////////////////////

export type ComponentDescriptor<Z extends ZodType> = {
	name: string;
	description: string;
	propsSchema: Z;
	element: React.FC<z.infer<Z>>;
};

////////////////////////////////////////////////////////////////////////////////

export type Descriptor<Z extends ZodType> = Omit<
	ComponentDescriptor<Z>,
	"element"
>;

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
		component.element = (props) => {
			component.propsSchema.parse(props);
			return component.element(props);
		};
		return component as ComponentDescriptor<Z>;
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
		name: "MyComponent",
		description: "A simple component",
		propsSchema: z.object({
			name: z.string(),
			age: z.number(),
		}),
		element: (props) => {
			const { name, age } = props;
			return (
				<div>
					<p>Name: {name}</p>
					<p>Age: {age}</p>
				</div>
			);
		},
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
	});

export const ComponentMap = describedComponentMap;
