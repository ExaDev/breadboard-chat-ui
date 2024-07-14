import { useState } from "react";
import { ComponentHandler } from "../../breadboard/types";
import layoutStyles from "../../styles/layout.module.scss";
import Button from "../input/Button";
import Select from "../input/Select";
import TextInput from "../input/TextInput";
import Form from "./Form";

type PetObject = {
	name: string;
	type: string;
}

export type PetFinderFormProps = {
	handler: ComponentHandler<PetObject>;
}
const PetFinderForm: React.FC<PetFinderFormProps> = ({handler}) => {
	const [petName, setPetName] = useState("");
	const [petType, setPetType] = useState("cat");
	const handlePetNameChange = (value: string) => {
		setPetName(value);
	}
	const handleSubmit = () => {
		handler({ name: petName, type: petType });
	}
	return (
		<Form>
			<div className={layoutStyles.flexVertical}>
				<h3>Find a pet</h3>
				<TextInput
					label="Pet Name"
					name="petName"
					value={petName}
					onChange={handlePetNameChange}
				/>
				<Select
					label="Pet Type"
					name="petType"
					value={petType}
					onChange={setPetType}
					options={[
						{ value: "cat", label: "Cat" },
						{ value: "dog", label: "Dog" },
					]}
				/>
				<Button title="Find" onClick={handleSubmit} />
			</div>
		</Form>
	);
};

export default PetFinderForm;
