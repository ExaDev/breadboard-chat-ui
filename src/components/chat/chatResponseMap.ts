import React from "react";
import ALovelyCat from "./ALovelyCat";
import HelloWorld from "./HelloWorld";
import PetFinderForm, { PetFinderFormProps } from "./PetFinderForm";

export type ComponentDescriptor = {
	name: string;
	description: string;
};

export interface DescribedComponent<P extends object, C extends React.FC<P>> {
	descriptor: ComponentDescriptor;
	component: C;
}
export class ComponentMap {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	map: Map<string, DescribedComponent<any, any>>;
	constructor() {
		this.map = new Map();
	}

	add<P extends object = object, C extends React.FC<P> = React.FC<P>>(
		descriptor: ComponentDescriptor,
		component: C
	): this {
		const id = generateId(descriptor);
		// component = {
		// 	...component,
		// 	descriptor,
		// };
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

	getById<T extends object, C extends React.FC<T>>(
		id: string
	): DescribedComponent<T, C> {
		return this.map.get(id)!;
	}

	hasId(id: string): boolean {
		return this.map.has(id);
	}

	getByDescriptor<T extends object, C extends React.FC<T>>(
		descriptor: ComponentDescriptor
	): DescribedComponent<T, C> {
		for (const [, describedComponent] of this.map.entries()) {
			if (describedComponent.descriptor === descriptor) {
				return describedComponent;
			}
		}
		throw new Error("Descriptor not found");
	}

	getByName<T extends object, C extends React.FC<T>>(
		name: string
	): DescribedComponent<T, C> {
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

	getComponentByDescriptor(descriptor: ComponentDescriptor) {
		return this.getByDescriptor(descriptor).component;
	}
	getComponentById(id: string) {
		return this.getById(id).component;
	}
	getComponentByName(name: string) {
		return this.getByName(name).component;
	}
	getAllComponents<T extends object, C extends React.FC<T>>(): C[] {
		return this.getAll().map(
			(describedComponent) => describedComponent.component
		);
	}
	getAllDescriptors(): ComponentDescriptor[] {
		return this.getAll().map(
			(describedComponent) => describedComponent.descriptor
		);
	}

	getRandomComponent<T extends object>(): React.FC<T> {
		const components = this.getAllComponents();
		const randomIndex = Math.floor(Math.random() * components.length);
		return components[randomIndex];
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getAll(): DescribedComponent<any, any>[] {
		return Array.from(this.map.values());
	}
	getRandom<T extends object, C extends React.FC<T>>(): DescribedComponent<
		T,
		C
	> {
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
	.add<PetFinderFormProps>(
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
	);

function generateId(descriptor: ComponentDescriptor): string {
	return descriptor.name;
}
