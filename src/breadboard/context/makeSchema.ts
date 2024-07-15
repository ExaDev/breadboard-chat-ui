import { JSONSchema7 } from "json-schema";
import { DescribedComponentMap } from "../../components/DescribedComponent";

export function makeSchema(componentMap: DescribedComponentMap): JSONSchema7 {
	return {
		$schema: "http://json-schema.org/draft-07/schema#",
		type: "object",
		properties: {
			component: {
				type: "string",
				enum: componentMap.getNames(),
			},
			rationale: {
				type: "string",
			},
			certainty: {
				type: "number",
				minimum: 0,
				maximum: 1
			},
			parameters: {
				description: "Optional parameters for the component",
				type: "object",
				oneOf: componentMap
					.getAllJsonSchemaDesciptors()
					.filter((descriptor) => ({
						description: `Parameters for the ${descriptor.name} component`,
						...descriptor.propsSchema,
					})),
			},
		},
		required: ["component", "rationale", "certainty"],
	} satisfies JSONSchema7;
}
