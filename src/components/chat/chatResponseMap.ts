import { z, ZodRawShape } from "zod";
import ALovelyCat from "./ALovelyCat";
import HelloWorld from "./HelloWorld";
import PetFinderForm from "./PetFinderForm";
import React from "react";

export const chatResponseMap = {
	cat: ALovelyCat,
	petFinder: PetFinderForm,
	helloWorld: HelloWorld,
};


type ComponentDescriptor = {
	name: string;
	description: string;
};


class ComponentMap {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	map: Map<ComponentDescriptor, React.FC<any>>;
	constructor() {
		this.map = new Map();
	}

	set<T>(descriptor: ComponentDescriptor, component: React.FC<T>) {
		this.map.set(descriptor, component);
	}

	get(descriptor: ComponentDescriptor) {
		return this.map.get(descriptor);
	}
}

const componentMap = new ComponentMap();

componentMap.set(
	{ name: "cat", description: "A picture of a cute cat" },
	ALovelyCat
);
componentMap.set(
	{
		name: "petFinder",
		description:
			"Find a pet by name and animal type will search an external api for the pet",
	},
	PetFinderForm
);
componentMap.set(
	{
		name: "helloWorld",
		description: "A component which say hello world to the user",
	},
	HelloWorld
);
