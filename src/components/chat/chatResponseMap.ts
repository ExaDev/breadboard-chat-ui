import { JSONSchema7 } from "json-schema";
import React from "react";
import ALovelyCat from "./ALovelyCat";
import HelloWorld from "./HelloWorld";
import { LoremFlickr } from "./LoremFlickr";
import PetFinderForm from "./PetFinderForm";

export type ComponentDescriptor = {
	name: string;
	description: string;
	parameters?: JSONSchema7;
};

export type DescribedComponent = {
	descriptor: ComponentDescriptor;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: React.FC | React.FC<any>;
};
export class ComponentMap {
	map: Map<string, DescribedComponent>;
	constructor() {
		this.map = new Map();
	}

	add<T>(
		descriptor: ComponentDescriptor,
		component: React.FC | React.FC<T>
	): this {
		const id = generateId(descriptor);
		if (!this.hasId(id)) {
			if (this.hasName(descriptor.name)) {
				throw new Error("Name already exists");
			}
			if (this.hasDescriptor(descriptor)) {
				throw new Error("Descriptor already exists");
			}
		}
		this.map.set(id, { descriptor, component });
		return this;
	}

	getById(id: string): DescribedComponent {
		return this.map.get(id)!;
	}

	hasId(id: string): boolean {
		return this.map.has(id);
	}

	getByDescriptor(descriptor: ComponentDescriptor): DescribedComponent {
		for (const [, describedComponent] of this.map.entries()) {
			if (describedComponent.descriptor === descriptor) {
				return describedComponent;
			}
		}
		throw new Error("Descriptor not found");
	}

	getByName(name: string): DescribedComponent {
		for (const [, describedComponent] of this.map.entries()) {
			if (describedComponent.descriptor.name === name) {
				return describedComponent;
			}
		}
		throw new Error("Name not found");
	}
	hasName(name: string): boolean {
		try {
			this.getByName(name);
			return true;
		} catch {
			return false;
		}
	}
	hasDescriptor(descriptor: ComponentDescriptor): boolean {
		try {
			this.getByDescriptor(descriptor);
			return true;
		} catch {
			return false;
		}
	}

	getComponentByDescriptor(descriptor: ComponentDescriptor): React.FC {
		return this.getByDescriptor(descriptor).component;
	}
	getComponentById(id: string): React.FC {
		return this.getById(id).component;
	}
	getComponentByName(name: string): React.FC {
		return this.getByName(name).component;
	}
	getAllComponents(): React.FC[] {
		return this.getAll().map(
			(describedComponent) => describedComponent.component
		);
	}
	getAllDescriptors(): ComponentDescriptor[] {
		return this.getAll().map(
			(describedComponent) => describedComponent.descriptor
		);
	}

	getRandomComponent(): React.FC {
		const components = this.getAllComponents();
		const randomIndex = Math.floor(Math.random() * components.length);
		return components[randomIndex];
	}

	getAll(): DescribedComponent[] {
		return Array.from(this.map.values());
	}
	getRandom(): DescribedComponent {
		const components = this.getAll();
		const randomIndex = Math.floor(Math.random() * components.length);
		return components[randomIndex];
	}
	getAllNames(): string[] {
		return this.getAllDescriptors().map((descriptor) => descriptor.name);
	}
}

export const componentMap = new ComponentMap();

componentMap
	.add({ name: "cat", description: "A picture of a cute cat" }, ALovelyCat)
	.add(
		{
			name: "petFinder",
			description:
				"Find a pet by name and animal type will search an external api for the pet",
		},
		PetFinderForm
	)
	.add(
		{
			name: "helloWorld",
			description: "A component which say hello world to the user",
		},
		HelloWorld
	)
	.add(
		{
			name: "LoremFlickr",
			description: "A component which fetches a random image from loremflickr",
			parameters: {
				type: "object",
				properties: {
					width: { type: "number" },
					height: { type: "number" },
					keywords: { type: "array", items: { type: "string" } },
					style: {
						description: "The style of the image",
						oneOf: [
							{ const: "g", description: "Grayscale" },
							{ const: "p", description: "Pixelated" },
							{ const: "red", description: "Red" },
							{ const: "green", description: "Green" },
							{ const: "blue", description: "Blue" },
						],
					},
					all: {
						type: "boolean",
						description: "Whether to search for all keywords inclusively",
					},
				},
				required: ["width", "height"],
			} satisfies JSONSchema7,
		},
		LoremFlickr
	);

function generateId(descriptor: ComponentDescriptor): string {
	return descriptor.name;
}
