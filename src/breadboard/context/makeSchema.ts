import { JSONSchema7 } from "json-schema";
import { ComponentMap } from "../../components/chat/chatResponseMap";

export function makeSchema(componentMap: ComponentMap): string {
	return JSON.stringify({
		$schema: "http://json-schema.org/draft-07/schema#",
		type: "object",
		properties: {
			component: {
				type: "string",
				enum: componentMap.getAllNames(),
			},
			rationale: {
				type: "string",
			},
			certainty: {
				type: "number",
				minimum: 0,
				maximum: 1,
				examples: [0, 0.1, 0.5, 0.9, 1],
			},
			parameters: {
				description: "Optional parameters for the component",
				type: "object"
			}
		},
		required: ["component", "rationale", "certainty"],
	} satisfies JSONSchema7);
}
