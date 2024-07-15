import { Component } from "react";
import { z, infer as zodInfer, ZodSchema } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

// Define the abstract class with generic types for props and state
abstract class AbstractComponent<P = object, S = object> extends Component<
	P,
	S
> {
	constructor(props: P) {
		super(props);
		this.validateProps(props);
	}

	abstract schema: ZodSchema<P>;

	validateProps(props: P) {
		const result = this.schema.safeParse(props);
		if (!result.success) {
			throw new Error("Invalid props");
		}
	}

	propsSchema() {
		return zodToJsonSchema(this.schema);
	}
	abstract render(): JSX.Element;
}

////////////////////////////////////////////////////////////

// Define the Zod schema for the component props
const MyComponentPropsSchema = z.object({
	title: z.string(),
	count: z.number(),
	isActive: z.boolean().optional(),
});

// Infer the TypeScript type from the Zod schema
type MyComponentProps = zodInfer<typeof MyComponentPropsSchema>;

// Concrete component class extending the abstract class
class MyComponent extends AbstractComponent<MyComponentProps> {
	schema = MyComponentPropsSchema;

	render() {
		const { title, count, isActive } = this.props;

		return (
			<Component title={title} count={count} isActive={isActive}></Component>
		);
	}
}

export default MyComponent;
